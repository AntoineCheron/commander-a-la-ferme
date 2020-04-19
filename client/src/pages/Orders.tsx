import React, { FunctionComponent } from 'react'
import { Route, RouteComponentProps, Switch, useHistory } from 'react-router-dom'
import { Radio, Typography } from 'antd'

import AppLayout from '../components/AppLayout'
import OrdersList from '../components/OrdersList'
import { Order } from '../models'
import { RadioChangeEvent } from 'antd/lib/radio'

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

      </Switch>
    </AppLayout>)
}

const Orders: FunctionComponent<{ statusFilter?: string[], activeKey?: string }> = ({ statusFilter, activeKey }) => {
  const history = useHistory()
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

const orders: Order[] = [
  {
    fullname: 'Antoine Cheron',
    telephone: '06.12.85.59.89',
    address: 'Le Pré de la Grande 61190 Bubertré',
    paymentMethod: 'carte',
    status: 'new',
    passedOn: new Date(Date.now()),
    items: [
      {
        id: '1',
        title: 'Crottin chèvres',
        category: 'Catégorie 1',
        price: 2.25,
        amount: 2
      },
      {
        id: '2',
        title: 'Crottin brebis',
        category: 'Catégorie 2',
        price: 22.25,
        amount: 4
      }
    ]
  },
  {
    fullname: 'Antoine Cheron (2)',
    telephone: '06.12.85.59.89',
    address: 'Le Pré de la Grande 61190 Bubertré',
    paymentMethod: 'carte',
    status: 'in-progress',
    passedOn: new Date(Date.now()),
    items: [
      {
        id: '1',
        title: 'Crottin chèvres',
        category: 'Catégorie 1',
        price: 2.25,
        amount: 2
      },
      {
        id: '2',
        title: 'Crottin brebis',
        category: 'Catégorie 2',
        price: 22.25,
        amount: 4
      }
    ]
  }
]

export default OrdersPage