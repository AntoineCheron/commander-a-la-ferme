import React, { FunctionComponent } from 'react'
import { Button, Card, Descriptions, Col, Row, Statistic, Tag, Typography, Tooltip } from 'antd'
import { CalendarOutlined, CreditCardOutlined, CommentOutlined, DownloadOutlined, EditOutlined, FlagOutlined, HomeOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons'

import { Order, statusColor } from '../../models'
import OrderedItemsList from './OrderedItemsList'

const { Title, Text } = Typography

const OrderDetails: FunctionComponent<{ order: Order }> = ({ order }) => {
  const orderPrice = order.items.map(item => item.price * item.amount).reduce((sum, value) => sum + value, 0)

  return <>
    <Title>Commande n°{order.id}</Title>

    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card>
          <Descriptions title="Informations" column={2}>
            <Descriptions.Item label={<Text><UserOutlined /> Nom du client</Text>}>{order.fullname}</Descriptions.Item>
            <Descriptions.Item label={<Text><PhoneOutlined /> Téléphone</Text>}>{order.telephone}</Descriptions.Item>
            {order.email && <Descriptions.Item label={<Text><MailOutlined /> Email</Text>}>{order.email}</Descriptions.Item>}
            <Descriptions.Item label={<Text><CalendarOutlined /> Passée le</Text>}>{order.passedOn.toLocaleDateString()}</Descriptions.Item>
            <Descriptions.Item label={<Text><HomeOutlined /> Adresse</Text>}>{order.address}</Descriptions.Item>
            <Descriptions.Item label={<Text><CreditCardOutlined /> Moyen de paiement</Text>}>{order.paymentMethod}</Descriptions.Item>
            <Descriptions.Item label={<Text><FlagOutlined /> Statut</Text>}><Tag color={statusColor[order.status]}>{order.status.toUpperCase()}</Tag></Descriptions.Item>
            {order.customerComment && <Descriptions.Item span={2} label={<Text><CommentOutlined /> Commentaire du client</Text>}>{order.customerComment}</Descriptions.Item>}
          </Descriptions>
        </Card>

      </Col>

      <Col span={6}>
        <Card style={{ height: '100%' }}>
          <Statistic title="Montant total" value={orderPrice} suffix="€" />
        </Card>
      </Col>

      <Col span={6}>
        <Card style={{ height: '100%' }}>
          <Title level={4}>Actions</Title>

          <Tooltip title="Cette fonctionnalité n'est pas encore disponible">
            <Button type="primary" disabled icon={<EditOutlined />} style={{ marginBottom: '16px' }}> Modifier le statut</Button>
          </Tooltip>

          <Tooltip title="Cette fonctionnalité n'est pas encore disponible">
            <Button type="primary" disabled icon={<DownloadOutlined />} style={{ marginBottom: '16px' }}> Télécharger au format Excel</Button>
          </Tooltip>
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