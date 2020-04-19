import React, { useState, FunctionComponent, useMemo } from 'react'
import { Button, Row, Typography, Result } from 'antd'
import { CheckOutlined } from '@ant-design/icons'

import { Farm, OrderableItem } from '../models'
import FarmCard from './FarmCard'
import OrderFormItemsSelector from './OrderFormItemsSelector'
import OrderSummary from './OrderSummary'

const { Title } = Typography

type Selection = { [category: string]: OrderableItem[] }

const OrderForm: FunctionComponent<{ farm: Farm }> = ({ farm }) => {
  const [validated, setValidated] = useState(false)

  const initialSelection: Selection = farm.inventory.map(item => {
    return {
      id: item.id,
      title: item.title,
      category: item.category,
      price: item.price,
      remaining: item.remaining,
      amount: 0
    }
  }).reduce((acc, item) => {
    acc[item.category] = [...(acc[item.category] || []), item]
    return acc
  }, {} as Selection)

  const [selection, setSelection] = useState<Selection>(initialSelection)
  const selectedItems = useMemo(() => Object.values(selection).flat(1).filter(item => item.amount !== 0), [selection])

  const validateOrder = () => {
    // TODO: call API
    setValidated(true)
  }

  if (validated) {
    return <OrderSuccessful farm={farm} selection={selectedItems} />
  } else {
    return <>
      <Title>Passer commande à {farm.name}</Title>

      <Row gutter={[16, 16]}> <FarmCard farm={farm} /> </Row>

      <OrderFormItemsSelector selection={selection} setSelection={setSelection} />

      <OrderSummary selection={selectedItems} />

      <Button type="primary" htmlType="submit" onClick={validateOrder} disabled={selectedItems.length === 0}>
        <CheckOutlined /> Valider ma commande
    </Button>
    </>
  }
}

const OrderSuccessful: FunctionComponent<{ farm: Farm, selection: OrderableItem[] }> = ({ farm, selection }) => <Result
  status="success"
  title="Commande passée avec succès"
  subTitle={`Votre commande a bien été transmise à ${farm.name}`}
>
  <OrderSummary selection={selection} />
</Result>

export default OrderForm