import React, { FunctionComponent } from 'react'
import { Card, Descriptions, Col, Row, Statistic, Tag, Typography } from 'antd'
import { CalendarOutlined, CreditCardOutlined, FlagOutlined, HomeOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons'

import { Order, statusColor } from '../models'
import OrderedItemsList from './OrderedItemsList'

const { Title, Text } = Typography

const OrderDetails: FunctionComponent<{ order: Order }> = ({ order }) => {
  const orderPrice = order.items.map(item => item.price * item.amount).reduce((sum, value) => sum + value, 0)

  return <>
    <Title>Commande n°{order.id}</Title>

    <Row gutter={[16, 16]}>
      <Col span={18}>
        <Card>
          <Descriptions title="Informations">
            <Descriptions.Item label={<Text><UserOutlined /> Nom du client</Text>}>{order.fullname}</Descriptions.Item>
            <Descriptions.Item label={<Text><PhoneOutlined /> Téléphone</Text>}>{order.telephone}</Descriptions.Item>
            {order.email && <Descriptions.Item label={<Text><MailOutlined /> Email</Text>}>{order.email}</Descriptions.Item>}
            <Descriptions.Item label={<Text><CalendarOutlined /> Passée le</Text>}>{order.passedOn.toLocaleDateString()}</Descriptions.Item>
            <Descriptions.Item label={<Text><HomeOutlined /> Adresse</Text>}>{order.address}</Descriptions.Item>
            <Descriptions.Item label={<Text><CreditCardOutlined /> Moyen de paiement</Text>}>{order.paymentMethod}</Descriptions.Item>
            <Descriptions.Item label={<Text><FlagOutlined /> Statut</Text>}><Tag color={statusColor[order.status]}>{order.status.toUpperCase()}</Tag></Descriptions.Item>
          </Descriptions>
        </Card>

      </Col>

      <Col span={6}>
        <Card style={{ height: '100%' }}>
          <Statistic title="Montant total" value={orderPrice} suffix="€" />
        </Card>
      </Col>
    </Row>

    <Row gutter={[16, 16]}>
      <Col span={24}>
        <OrderedItemsList items={order.items} />
      </Col>
    </Row>
  </>
}

export default OrderDetails