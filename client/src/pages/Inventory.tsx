import React, { useState, useMemo, FunctionComponent } from 'react'
import { message, Skeleton, Typography } from 'antd'
import { AxiosError } from 'axios'

import AppLayout from '../components/AppLayout'
import Inventory from '../components/Inventory'
import ErrorResult from '../components/ErrorResult'
import InventoryService from '../services/InventoryService'
import { InventoryItem } from '../models'
import { useEffectWrapper } from '../hooks'

const { Title, Paragraph } = Typography

const InventoryPage: FunctionComponent<{}> = () => {
  const inventoryService = useMemo(() => new InventoryService(), [])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AxiosError>()
  const [items, setItems] = useState<InventoryItem[]>([])

  useEffectWrapper((isMounted) => {
    setIsLoading(true)
    inventoryService.getInventory()
      .then(data => { if (isMounted) setItems(data) })
      .catch(error => { if (isMounted) setError(error) })
      .finally(() => { if (isMounted) setIsLoading(false) })
  }, [])

  const addItem = (category: string) => {
    const itemId = `pending-${genRandomNumber()}`
    const item = { id: itemId, title: 'Titre', category, price: 0, remaining: 0, ordered: 0 }
    setItems([...items, item])

    return itemId
  }

  const editItem = (key: string, item: InventoryItem) => {
    const itemWithId = { ...item, id: key }
    if (items.find(i => i.id === key) !== undefined) {
      const newData = [...items]
      const index = newData.findIndex(i => i.id === key)
      newData.splice(index, 1, itemWithId)
      setItems(newData)

      if (itemWithId.id.startsWith('pending')) {
        const copy = Object.assign({}, item)
        inventoryService.create(copy)
          .then(newItem => {
            const itemsCopy = items.map(i => i.id === itemWithId.id ? newItem : i)
            setItems(itemsCopy)
          })
          .catch(error => message.error(`Une erreur s'est produite lors de la création du produit ${item.title}. Le serveur a retourné : ${error.message}`))
      } else {
        inventoryService.update(itemWithId)
          .catch(error => message.error(`Une erreur s'est produite lors de la modification du produit ${item.title}. Le serveur a retourné : ${error.message}`))
      }
    }
  }

  return (
    <AppLayout>
      <Title>Stock</Title>
      <Paragraph>Gérez votre stock et suivez les quantités commandées</Paragraph>

      {
        isLoading ? <Skeleton active />
          : error !== undefined ? <ErrorResult error={error} title="Impossible de charger l'inventaire" />
            : <Inventory items={items} addItem={addItem} editItem={editItem} />
      }

    </AppLayout>)
}

function genRandomNumber(): number {
  return Math.floor((Math.random() * 1000000) + 1);
}

export default InventoryPage
