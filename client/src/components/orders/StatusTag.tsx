import React from 'react'
import { OrderStatus } from '../../models'
import { Tag } from 'antd'

const StatusTag: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const color = statusColor[status]
  const label = statusLabel[status]

  return <Tag color={color}>{label}</Tag>
}

const statusColor = {
  'nouvelle': '#2db7f5',
  'en cours de préparation': '',
  'acceptée': '',
  'complétée': '#87d068',
  'livrée': '#87d068',
  'annulée': '#108ee9'
}

const statusLabel = {
  'nouvelle': 'NEW',
  'en cours de préparation': 'EN COURS',
  'acceptée': 'ACCEPTÉE',
  'complétée': 'COMPLÉTÉE',
  'livrée': 'LIVRÉE',
  'annulée': 'ANNULÉE'
}

export default StatusTag
