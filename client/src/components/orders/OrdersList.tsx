import React, { useMemo, FunctionComponent } from 'react'
import { Button, Table, Typography, Col, Row } from 'antd'

import { Order, OrderStatus } from '../../models'
import { useHistory } from 'react-router-dom'
import StatusTag from './StatusTag'

const { Text } = Typography

type OrdersListProps = { orders: Order[], search?: string }

const OrdersList: FunctionComponent<OrdersListProps> = ({ orders, search }) => {
  const history = useHistory()

  const ordersWithTotal = useMemo(() => orders.map(order => {
    const total = order.items.map(item => item.price * item.amount).reduce((sum, value) => sum + value, 0)
    return { ...order, total }
  }), [orders])

  const filteredOrders = useMemo(() => {
    if (search === undefined || search === '') {
      return ordersWithTotal
    } else {
      const s = search.toLowerCase()
      return ordersWithTotal.filter(order =>
        order.fullname.toLowerCase().includes(s) || order.telephone.toLowerCase().includes(s) || order.address.toLowerCase().includes(s)
      )
    }
  }, [ordersWithTotal, search])

  const columns = [
    {
      title: 'Pour',
      dataIndex: 'fullname',
      key: 'fullname',
      sorter: (a: Order, b: Order) => a.fullname.localeCompare(b.fullname)
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
      render: (_: any, record: Order) => (
        <span>
          <Button onClick={() => history.push(`/app/commande/${record.id}`)}>Voir les details</Button>
        </span>
      ),
    },
  ];

  return <Table columns={columns} dataSource={filteredOrders} pagination={{ showSizeChanger: true, defaultPageSize: 20 }} />
}

export default OrdersList