import React, { FunctionComponent } from 'react'
import { Button, Table, Typography } from 'antd'

import { Order, OrderStatus } from '../../models'
import { useHistory } from 'react-router-dom'
import StatusTag from './StatusTag'

const { Text } = Typography

type OrdersListProps = { orders: Order[] }

const OrdersList: FunctionComponent<OrdersListProps> = ({ orders }) => {
  const history = useHistory()
  const ordersWithTotal = orders.map(order => {
    const total = order.items.map(item => item.price * item.amount).reduce((sum, value) => sum + value, 0)
    return { ...order, total }
  })

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
      render: (status: OrderStatus) => <StatusTag status={status} />,
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
          <Button onClick={() => history.push(`/app/commande/${record.id}`)}>Voir les details</Button>
        </span>
      ),
    },
  ];

  return <>
    <Table columns={columns} dataSource={ordersWithTotal} pagination={{ showSizeChanger: true, defaultPageSize: 20 }} />
  </>
}

export default OrdersList