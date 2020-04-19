import React, { FunctionComponent } from 'react'
import { Table, Typography } from 'antd'

import { OrderedItem } from '../models'

const { Text } = Typography

type OrderedItemsListProps = { items: OrderedItem[] }

const OrderedItemsList: FunctionComponent<OrderedItemsListProps> = ({ items }) => {
  const itemsWithTotal = items.map(item => {
    const total = item.price * item.amount
    return { ...item, total }
  })

  const columns = [
    {
      title: 'Produit',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Quantité',
      dataIndex: 'amount',
      key: 'amount'
    },
    {
      title: 'Prix Unitaire',
      key: 'price',
      dataIndex: 'price',
      render: (text: string) => <Text>{text}€</Text>
    },
    {
      title: 'Prix Total',
      dataIndex: 'total',
      key: 'total',
      render: (text: string) => <Text>{text}€</Text>
    }
  ];

  return <>
    <Table columns={columns} dataSource={itemsWithTotal} pagination={false} />
  </>
}

export default OrderedItemsList