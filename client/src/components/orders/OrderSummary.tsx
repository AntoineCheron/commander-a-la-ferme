import React, { FunctionComponent } from 'react'
import { Card, Col, Row, Typography } from 'antd'
import { OrderableItem } from '../../models'

const { Paragraph, Title } = Typography

const OrderSummary: FunctionComponent<{ selection: OrderableItem[] }> = ({ selection }) => {
  const total = selection.map(item => item.amount * item.price).reduce((sum, value) => sum + value, 0)

  return <>
    <Title level={3}>Récapitulatif de votre commande</Title>

    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card>
          {selection.map(item =>
            <Paragraph>{item.amount} {item.title} - {item.amount * item.price}€</Paragraph>
          )}
          <Paragraph><b>Montant total de la commande : {total}€</b></Paragraph>
        </Card>
      </Col>
    </Row>
  </>
}

export default OrderSummary