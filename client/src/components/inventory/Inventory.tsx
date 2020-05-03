import React, { useState, useMemo, FunctionComponent } from 'react'
import { Button, Typography, notification, Input } from 'antd'
import { PlusOutlined, SmileOutlined } from '@ant-design/icons'

import { InventoryItem } from '../../models'
import EditableInventoryTable from './EditableInventoryTable'
import InventoryService from '../../services/InventoryService'

const { Title } = Typography

interface InventoryProps { items: InventoryItem[], addItem: (category: string) => string, editItem: (k: string, i: InventoryItem) => void, refresh: () => void }

const Inventory: FunctionComponent<InventoryProps> = ({ items, addItem, editItem, refresh }) => {
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
      return <CategoryInventory key={category} items={filteredItems} category={category} addItem={addItem} editItem={editItem} refresh={refresh} />
    })
    }
  </>
}

const CategoryInventory: FunctionComponent<InventoryProps & { category: string }> = ({ items, category, addItem, editItem, refresh }) => {
  const [lastAddedItem, setLastAddedItem] = useState<string>()

  const editCategory = (newCategoryName: string) =>
    new InventoryService()
      .updateCategoryName(category, newCategoryName)
      .then(refresh)

  return (<>
    <Title level={4} editable={{ onChange: editCategory }}>{category}</Title>
    <EditableInventoryTable items={items} lastAddedItem={lastAddedItem} editItem={(key, item) => editItem(key, { ...item, category: category })} />
    <Button type="default" icon={<PlusOutlined />} style={{ marginBottom: '16px' }} onClick={() => setLastAddedItem(addItem(category))}>
      Ajouter un produit
    </Button>
  </>)
}

export default Inventory