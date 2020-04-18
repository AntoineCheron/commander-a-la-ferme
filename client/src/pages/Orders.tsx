import React, { FunctionComponent } from 'react'
import { Typography } from 'antd'

import AppLayout from '../components/AppLayout'

const { Title } = Typography

const OrdersPage: FunctionComponent<{}> = () => {
  return (
    <AppLayout>
      <Title>Commandes</Title>
    </AppLayout>)
}

export default OrdersPage