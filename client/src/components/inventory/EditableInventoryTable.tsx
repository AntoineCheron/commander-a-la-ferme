import React, { useState, FunctionComponent, useEffect } from 'react'
import { Form, Table } from 'antd'

import { InventoryItem } from '../../models'
import EditableCell from './EditableCell'

interface InventoryProps { items: InventoryItem[], lastAddedItem?: string, editItem: (k: string, i: InventoryItem) => void }

const EditableInventoryTable: FunctionComponent<InventoryProps> = ({ items, editItem, lastAddedItem }) => {
  const [form] = Form.useForm()
  const [editingKey, setEditingKey] = useState('')

  useEffect(() => {
    if (lastAddedItem !== undefined) setEditingKey(lastAddedItem)
  }, [lastAddedItem])

  const isEditing = (record: InventoryItem) => record.id === editingKey

  const edit = (record: InventoryItem) => {
    form.setFieldsValue({ ...record })
    setEditingKey(record.id)
  }

  const cancel = () => setEditingKey('')

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as InventoryItem
      editItem(key as string, row)
      setEditingKey('')
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const columns = [
    {
      title: 'Nom du produit',
      dataIndex: 'title',
      width: '40%',
      editable: true,
    },
    {
      title: 'Prix (unitaire ou au kg)',
      dataIndex: 'price',
      width: '20%',
      editable: true,
    },
    {
      title: 'Quantité restante',
      dataIndex: 'remaining',
      width: '15%',
      editable: true,
    },
    {
      title: 'Commandés',
      dataIndex: 'ordered',
      width: '15%',
      editable: false,
    },
    {
      title: 'Actions',
      dataIndex: 'operation',
      render: (_: any, record: InventoryItem) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <a href="#" onClick={() => save(record.id)} style={{ marginRight: 8 }}>
              Enregistrer
            </a>

            <a href="#" onClick={cancel}>Annuler</a>
          </span>
        ) : (
            // <a disabled={editingKey !== ''} onClick={() => edit(record)}>
            <a onClick={() => edit(record)}>
              Modifier
            </a>
          )
      },
    },
  ]

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: InventoryItem) => ({
        record,
        inputType: ['price', 'remaining', 'ordered'].includes(col.dataIndex) ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: { cell: EditableCell },
        }}
        bordered
        dataSource={items}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
        style={{ marginBottom: '16px' }}
      />
    </Form>
  )
}

export default EditableInventoryTable
