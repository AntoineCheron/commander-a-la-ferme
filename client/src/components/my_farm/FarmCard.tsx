import React, { FunctionComponent } from 'react'
import { Card, Descriptions, Tag, Typography } from 'antd'
import { EditOutlined, CreditCardOutlined, HomeOutlined, PhoneOutlined } from '@ant-design/icons'

import { Farm } from '../../models'

const { Text } = Typography

const FarmCard: FunctionComponent<{ farm: Farm }> = ({ farm }) =>
  <Card>
    <Descriptions column={1} title="Informations générales de l'exploitation">
      <Descriptions.Item label={<Text><PhoneOutlined /> Téléphone</Text>}>{farm.telephone}</Descriptions.Item>
      <Descriptions.Item label={<Text><HomeOutlined /> Adresse</Text>}>{farm.address}</Descriptions.Item>
      {
        farm.paymentMethods.length === 1
          ? <Descriptions.Item label={<Text><CreditCardOutlined /> Seul moyen de paiement accepté</Text>}>{farm.paymentMethods.map(method => <Tag key={method}>{method}</Tag>)}</Descriptions.Item>
          : <Descriptions.Item label={<Text><CreditCardOutlined /> Moyens de paiement acceptés</Text>}>{farm.paymentMethods.map(method => <Tag key={method}>{method}</Tag>)}</Descriptions.Item>
      }
      <Descriptions.Item label={<Text><EditOutlined /> Présentation</Text>}>{farm.description}</Descriptions.Item>
    </Descriptions>
  </Card>

export default FarmCard