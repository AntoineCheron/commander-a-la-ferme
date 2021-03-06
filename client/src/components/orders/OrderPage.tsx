import React, { FunctionComponent, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button } from 'antd'
import { LeftOutlined } from '@ant-design/icons'

import AppLayout from '../layout/AppLayout'
import OrderService from '../../services/OrderService'
import OrderDetails from './OrderDetails'
import Fetch from '../commons/Fetch'

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
      {(order, refresh) => <OrderDetails order={order} refresh={refresh} />}
    </Fetch>
  </AppLayout>
}

export default Order