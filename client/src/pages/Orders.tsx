import React, { FunctionComponent } from 'react'
import { Route, RouteComponentProps, Switch, useHistory, useParams, Redirect } from 'react-router-dom'
import { Radio, Typography } from 'antd'

import AppLayout from '../components/AppLayout'
import OrdersList from '../components/OrdersList'
import { RadioChangeEvent } from 'antd/lib/radio'
import OrderService from '../services/OrderService'

const { Title } = Typography

const OrdersPage: FunctionComponent<RouteComponentProps> = ({ match }) => {
  return (
    <AppLayout>
      <Title>Commandes</Title>
      <Switch>
        <Route path={[match.url, match.url + "/a-preparer"]} exact>
          <Orders statusFilter={['new', 'in-progress']} activeKey="todo" />
        </Route>

        <Route path={`${match.url}/terminees`} exact>
          <Orders statusFilter={['completed', 'canceled']} activeKey="done" />
        </Route>

        <Route path={`${match.url}/toutes`} exact>
          <Orders activeKey="all" />
        </Route>

        <Route path={`${match.url}`} ><Redirect to={`${match.url}`} /></Route>
      </Switch>
    </AppLayout>)
}

const Orders: FunctionComponent<{ statusFilter?: string[], activeKey?: string }> = ({ statusFilter, activeKey }) => {
  const history = useHistory()
  const orders = OrderService.getAll()
  const filteredOrders = orders.filter(order => statusFilter === undefined || statusFilter.includes(order.status))

  const handleModeChange = (e: RadioChangeEvent) => {
    const targetUrl = e.target.value === 'todo' ? '/commandes/a-preparer'
      : e.target.value === 'done' ? '/commandes/terminees'
        : '/commandes/toutes'
    history.push(targetUrl)
  }

  return <>
    <Radio.Group onChange={handleModeChange} value={activeKey} style={{ marginBottom: 8 }}>
      <Radio.Button value="todo">A préparer</Radio.Button>
      <Radio.Button value="done">Terminées</Radio.Button>
      <Radio.Button value="all">Toutes</Radio.Button>
    </Radio.Group>
    <OrdersList orders={filteredOrders} />
  </>
}

export default OrdersPage