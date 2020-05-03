import React, { useState } from 'react'
import { OrderStatus, ORDER_STATUS } from '../../models'
import OrderService from '../../services/OrderService'
import BaseActionModal from '../commons/BaseActionModal'
import { Radio } from 'antd'
import StatusTag from './StatusTag'

type Props = {
  orderId: string,
  initialValue: OrderStatus,
  onSuccess: () => void
}

const UpdateStatusModal: React.FC<Props> = ({ orderId, initialValue, onSuccess }) => {
  const orderService = new OrderService()
  const [status, setStatus] = useState<OrderStatus>(initialValue)

  const save = async () => {
    if (status !== initialValue) {
      await orderService.updateStatus(orderId, status)
    }
  }

  return <BaseActionModal f={save} title="Mettre à jour le statut" callback={onSuccess} closable={true}>
    <Radio.Group onChange={e => setStatus(e.target.value)} value={status}>
      {ORDER_STATUS.map(status =>
        <Radio key={status} style={radioStyle} value={status}>
          <StatusTag status={status} />
        </Radio>
      )}
    </Radio.Group>
  </BaseActionModal>
}

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}

export default UpdateStatusModal