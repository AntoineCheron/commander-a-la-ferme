import React, { FunctionComponent } from 'react'
import { Button, Table, Tag, Typography } from 'antd'

import { Order, OrderStatus, statusColor } from '../models'

const { Text } = Typography

type OrdersListProps = { orders: Order[] }

const OrdersList: FunctionComponent<OrdersListProps> = ({ orders }) => {

  const ordersWithTotal = orders.map(order => {
    const total = order.items.map(item => item.price * item.amount).reduce((sum, value) => sum + value, 0)
    return { ...order, total }
  })

  return <>
    <Table columns={columns} dataSource={ordersWithTotal} pagination={{ showSizeChanger: true, defaultPageSize: 20 }} />
  </>
}

const columns = [
  {
    title: 'Pour',
    dataIndex: 'fullname',
    key: 'fullname'
  },
  {
    title: 'Montant',
    dataIndex: 'total',
    key: 'total',
    render: (text: string) => <Text>{text}€</Text>
  },
  {
    title: 'Statut',
    key: 'status',
    dataIndex: 'status',
    render: (status: OrderStatus) => (
      <Tag color={statusColor[status]}>{status.toUpperCase()}</Tag>
    ),
  },
  {
    title: 'Telephone',
    dataIndex: 'telephone',
    key: 'fullname',
  },
  {
    title: 'Adresse',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Action',
    key: 'action',
    render: (text: any, record: Order) => (
      <span>
        <Button>Voir les details</Button>
      </span>
    ),
  },
];

export default OrdersList