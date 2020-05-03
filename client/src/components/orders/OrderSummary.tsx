import React, { FunctionComponent } from 'react'
import { Card, Col, Row, Typography, Alert } from 'antd'
import { OrderableItem } from '../../models'

const { Paragraph, Title } = Typography

const OrderSummary: FunctionComponent<{ selection: OrderableItem[], farmName?: string }> = ({ selection, farmName }) => {
  const total = selection.map(item => item.amount * item.price).reduce((sum, value) => sum + value, 0)

  return <>
    <Title level={3}>Récapitulatif de votre commande</Title>

    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card>
          {selection.map(item =>
            <Paragraph>{item.amount} {item.title} - {item.amount * item.price}€</Paragraph>
          )}
          <Paragraph><b>Montant estimé de la commande : {total}€</b></Paragraph>
          <Paragraph>
            <Alert
              message={`Le montant est donné à titre informatif, il est susceptible de varier en fonction des quantités réelles, pour tous les produits au kilo. Le montant final de la commande vous sera communiqué par ${farmName || "l'exploitation"}.`}
              type="warning" showIcon closable />
          </Paragraph>
        </Card>
      </Col>
    </Row>
  </>
}

export default OrderSummary