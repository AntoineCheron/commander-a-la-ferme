import React, { FunctionComponent } from 'react'
import { Typography } from 'antd'

import AppLayout from '../components/AppLayout'
import OrdersList from '../components/OrdersList'
import { Order } from '../models'

const { Title } = Typography

const OrdersPage: FunctionComponent<{}> = () => {
  return (
    <AppLayout>
      <Title>Commandes</Title>
      <OrdersList orders={orders} />
    </AppLayout>)
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
  }
]

export default OrdersPage