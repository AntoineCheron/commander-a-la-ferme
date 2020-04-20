import React, { FunctionComponent, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button } from 'antd'
import { LeftOutlined } from '@ant-design/icons'

import AppLayout from '../components/AppLayout'
import OrderService from '../services/OrderService'
import OrderDetails from '../components/OrderDetails'
import Fetch from '../components/Fetch'

const Order: FunctionComponent<{}> = () => {
  const history = useHistory()
  const { orderId } = useParams<{ orderId: string }>()
  const orderService = useMemo(() => new OrderService(), [])

  return <AppLayout>
    <Button type="link" icon={<LeftOutlined />} onClick={() => history.goBack()} style={{ paddingLeft: 0 }}>Retourner à la liste des commandes</Button>
    <Fetch
      fct={() => orderService.findById(orderId)}
      errorTitle="Commande non trouvée"
      errorSubTitle="Désolé, nous n'avons pas trouvé cette commande."
      errorExtra={<Button type="primary" onClick={() => history.goBack()}>Retourner à la page précédente</Button>}
    >
      {order => <OrderDetails order={order} />}
    </Fetch>
  </AppLayout>
}

export default Order