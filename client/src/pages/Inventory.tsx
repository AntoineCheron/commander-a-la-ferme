import React, { useState, FunctionComponent } from 'react'
import { Typography } from 'antd'

import AppLayout from '../components/AppLayout'
import { InventoryItem } from '../models'
import Inventory from '../components/Inventory'

const { Title, Paragraph } = Typography

const InventoryPage: FunctionComponent<{}> = () => {
  const [items, setItems] = useState<InventoryItem[]>(inventory)

  const addItem = (category: string) => {
    const itemId = `pending-${genRandomNumber()}`
    setItems([
      ...items,
      { id: itemId, title: 'Titre', category, price: 0, remaining: 0, ordered: 0 }
    ])
    return itemId
  }

  const editItem = (key: string, item: InventoryItem) => {
    console.log(item)
    if (items.find(item => item.id === key) !== undefined) {
      const newData = [...items]
      const index = newData.findIndex(item => key === item.id)
      newData.splice(index, 1, item)
      setItems(newData)
    }
  }

  return (
    <AppLayout>
      <Title>Stock</Title>
      <Paragraph>Gérez votre stock et suivez les quantités commandées</Paragraph>

      <Inventory items={items} addItem={addItem} editItem={editItem} />

    </AppLayout>)
}

function genRandomNumber(): number {
  return Math.floor((Math.random() * 1000000) + 1);
}

const inventory: InventoryItem[] = [
  { id: '1', title: 'Crottins de brebis BIO', category: 'Produits en lait BIO de brebis', price: 2.50, remaining: 80, ordered: 20 },
  { id: '2', title: 'Crottins de chèvre BIO', category: 'Produits en lait BIO de chèvres', price: 2.25, remaining: 80, ordered: 20 },
  { id: 'pending-3', title: 'Crottins de brebis', category: 'Produits en lait BIO de brebis', price: 2.50, remaining: 80, ordered: 20 },
]

export default InventoryPage