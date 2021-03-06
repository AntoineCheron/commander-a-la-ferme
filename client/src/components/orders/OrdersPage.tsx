import React, { FunctionComponent, useMemo, useState } from 'react'
import { Route, Switch, useHistory, Redirect } from 'react-router-dom'
import { Radio, Row, Skeleton, Typography, Input, Col } from 'antd'

import AppLayout from '../layout/AppLayout'
import OrdersList from './OrdersList'
import { RadioChangeEvent } from 'antd/lib/radio'
import OrderService from '../../services/OrderService'
import Fetch from '../commons/Fetch'
import { Order } from '../../models'
import OrderingFormUrlAlert from './OrderingFormUrlAlert'

const { Title } = Typography

const OrdersPage: FunctionComponent<{}> = () => {
  return (
    <AppLayout>
      <Title>Commandes</Title>

      <Row style={{ marginBottom: '16px' }}>
        <OrderingFormUrlAlert />
      </Row>

      <Switch>
        <Route path={['/app/commandes', "/app/commandes/nouvelles"]} exact>
          <Orders statusFilter={['nouvelle']} activeKey="new" />
        </Route>

        <Route path='/app/commandes/a-preparer' exact>
          <Orders statusFilter={['acceptée', 'en cours de préparation']} activeKey="todo" />
        </Route>

        <Route path='/app/commandes/terminees' exact>
          <Orders statusFilter={['complétée', 'livrée', 'annulée']} activeKey="done" />
        </Route>

        <Route path='/app/commandes/toutes' exact>
          <Orders activeKey="all" />
        </Route>

        <Route path={'/app/commandes/*'} ><Redirect to={'/app/commandes'} /></Route>
      </Switch>
    </AppLayout>)
}

const Orders: FunctionComponent<{ statusFilter?: string[], activeKey?: string }> = ({ statusFilter, activeKey }) => {
  const history = useHistory()
  const orderService = useMemo(() => new OrderService(), [])

  const [search, setSearch] = useState<string>('')

  const filterOrdersByStatus = (orders: Order[]) => orders.filter(order => statusFilter === undefined || statusFilter.includes(order.status))

  const handleModeChange = (e: RadioChangeEvent) => {
    const targetUrl = e.target.value === 'new' ? '/app/commandes/nouvelles'
      : e.target.value === 'todo' ? '/app/commandes/a-preparer'
        : e.target.value === 'done' ? '/app/commandes/terminees'
          : '/app/commandes/toutes'
    history.push(targetUrl)
  }

  return <>
    <Row>
      <Col span={8}>
        <Radio.Group onChange={handleModeChange} value={activeKey} style={{ marginBottom: 8 }}>
          <Radio.Button value="new">Nouvelles</Radio.Button>
          <Radio.Button value="todo">A préparer</Radio.Button>
          <Radio.Button value="done">Terminées</Radio.Button>
          <Radio.Button value="all">Toutes</Radio.Button>
        </Radio.Group>
      </Col>

      <Col span={16}>
        <Input.Search
          placeholder="Rechercher une commande, par nom de client, téléphone ou adresse."
          onChange={e => setSearch(e.target.value)}
          onSearch={setSearch}
          style={{ width: '100%' }}
        />
      </Col>
    </Row>

    <Fetch
      fct={() => orderService.getAll()}
      errorTitle="Oups, nous n'arrivons pas à récupérer vos commandes"
      loading={() => <Skeleton active />}
    >
      {orders => <OrdersList orders={filterOrdersByStatus(orders)} search={search} />}
    </Fetch>
  </>
}

export default OrdersPage