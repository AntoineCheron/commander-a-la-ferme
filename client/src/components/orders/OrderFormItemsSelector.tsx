import React, { FunctionComponent } from 'react'
import { Card, Form, Col, Row, Typography, InputNumber } from 'antd'

import { OrderableItem } from '../../models'

const { Title, Text } = Typography

type Selection = { [category: string]: OrderableItem[] }
type Props = {
  selection: Selection,
  setSelection: (s: Selection) => void
}

const OrderFormItemsSelector: FunctionComponent<Props> = ({ selection, setSelection }) => {
  const categories = Object.keys(selection)

  return <>
    <Title level={3}>Selection des produits</Title>

    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card>
          <Form name="selection" validateMessages={validateMessages}>
            {categories.map(category =>
              <CategorySelector
                categoryName={category}
                setItems={(items) => setSelection({ ...selection, [category]: items })}
                items={selection[category]}
              />)
            }
          </Form>
        </Card>
      </Col>
    </Row>
  </>
}

type CategorySelectorProps = { items: OrderableItem[], categoryName: string, setItems: (items: OrderableItem[]) => void }

const CategorySelector: FunctionComponent<CategorySelectorProps> = ({ items, categoryName, setItems }) => {

  const onChange = (value: number | undefined, item: OrderableItem) => {
    item.amount = value || 0
    setItems(items)
  }

  return <>
    <Title level={4}>{categoryName}</Title>
    {
      items.map(item =>
        <Form.Item
          name={item.title}
          label={<Text><b>{item.title}</b> - Prix (unitaire ou au kg): {item.price}€ - Quantité restante: {item.remaining} </Text>}
          rules={[{ type: 'number', min: 0, max: item.remaining }]}
        >
          <InputNumber value={item.amount} onChange={value => onChange(value, item)} />
        </Form.Item>
      )
    }
  </>
}

const validateMessages = {
  number: {
    // eslint-disable-next-line no-template-curly-in-string
    range: 'Doit être compris entre ${min} et ${max}',
  },
}

export default OrderFormItemsSelector