import React from 'react'
import { Tag } from 'antd'
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  HomeOutlined,
  SmileOutlined
} from '@ant-design/icons'

import { OrderStatus } from '../../models'

const StatusTag: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const color = statusColor[status]
  const label = statusLabel[status]
  const icon = statusIcon(status)

  return <Tag icon={icon} color={color}>{label}</Tag>
}

const statusColor = {
  'nouvelle': 'blue',
  'en cours de préparation': 'purple',
  'acceptée': 'geekblue',
  'complétée': 'success',
  'livrée': 'gold',
  'annulée': 'error'
}

const statusLabel = {
  'nouvelle': 'NEW',
  'en cours de préparation': 'EN COURS',
  'acceptée': 'ACCEPTÉE',
  'complétée': 'COMPLÉTÉE',
  'livrée': 'LIVRÉE',
  'annulée': 'ANNULÉE'
}

function statusIcon(status: OrderStatus) {
  if (status === 'nouvelle') {
    return <ExclamationCircleOutlined />
  } else if (status === 'en cours de préparation') {
    return <SyncOutlined />
  } else if (status === 'acceptée') {
    return <SmileOutlined />
  } else if (status === 'complétée') {
    return <CheckCircleOutlined />
  } else if (status === 'livrée') {
    return <HomeOutlined />
  } else if (status === 'annulée') {
    return <CloseCircleOutlined />
  } else {
    return null
  }
}

export default StatusTag
