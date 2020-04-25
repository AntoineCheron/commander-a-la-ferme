import React, { useState, useMemo, FunctionComponent } from 'react'
import { Button, Typography, notification } from 'antd'
import { PlusOutlined, SmileOutlined } from '@ant-design/icons'

import { InventoryItem } from '../../models'
import EditableInventoryTable from './EditableInventoryTable'

const { Title } = Typography

interface InventoryProps { items: InventoryItem[], addItem: (category: string) => string, editItem: (k: string, i: InventoryItem) => void }

const Inventory: FunctionComponent<InventoryProps> = ({ items, addItem, editItem }) => {
  const [addedCategories, setAddedCategories] = useState<string[]>([])

  const categoriesFromItems: Array<string> = Array.from(new Set(items.map(item => item.category)))
  const categories = useMemo(() => Array.from(new Set(categoriesFromItems.concat(addedCategories))), [categoriesFromItems, addedCategories])

  const addCategory = () => {
    const title = prompt('Saisissez le nom de la catégorie de produit à créer')
    if (title !== null) {
      setAddedCategories(addedCategories.concat([title]))
      notification.open({ message: 'Catégorie créée avec succès', icon: <SmileOutlined style={{ color: '#108ee9' }} /> })
    }
  }

  return <>
    <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: '16px' }} onClick={addCategory}>
      Ajouter une catégorie de produits
    </Button>

    {categories.map(category => {
      const filteredItems = items.filter(item => item.category === category)
      return <CategoryInventory key={category} items={filteredItems} category={category} addItem={addItem} editItem={editItem} />
    })
    }
  </>
}

const CategoryInventory: FunctionComponent<InventoryProps & { category: string }> = ({ items, category, addItem, editItem }) => {
  const [lastAddedItem, setLastAddedItem] = useState<string>()
  return (<>
    <Title level={4}>{category}</Title>
    <EditableInventoryTable items={items} lastAddedItem={lastAddedItem} editItem={(key, item) => editItem(key, { ...item, category: category })} />
    <Button type="dashed" icon={<PlusOutlined />} style={{ marginBottom: '16px' }} onClick={() => setLastAddedItem(addItem(category))}>
      Ajouter un produit
    </Button>
  </>)
}

export default Inventory