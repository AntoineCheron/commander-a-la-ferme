import React, { FunctionComponent } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Result } from 'antd'
import { LeftOutlined } from '@ant-design/icons'

import AppLayout from '../components/AppLayout'
import OrderService from '../services/OrderService'
import OrderDetails from '../components/OrderDetails'

const Order: FunctionComponent<{}> = () => {
  const history = useHistory()
  const { orderId } = useParams<{ orderId: string }>()
  const order = OrderService.findById(orderId)

  return <AppLayout>
    <Button type="link" icon={<LeftOutlined />} onClick={() => history.goBack()} style={{ paddingLeft: 0 }}>Retourner à la liste des commandes</Button>
    {
      order !== undefined
        ? <OrderDetails order={order} />
        : <Result
          status="404"
          title="Commande non trouvée"
          subTitle="Désolé, nous n'avons pas trouvé cette commande."
          extra={<Button type="primary" onClick={() => history.goBack()}>Retourner à la page précédente</Button>}
        />
    }
  </AppLayout>
}

export default Order