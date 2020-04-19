import React, { FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'
import { Layout, Result } from 'antd'

import OrderForm from '../components/OrderForm'
import FormService from '../services/FormService'

const { Content } = Layout

const PublicForm: FunctionComponent<{}> = () => {
  const { farmName } = useParams<{ farmName: string }>()
  const farm = FormService.getInventoryOfFarm(farmName)

  return <Layout>
    <Content style={{ padding: '30px 50px', minHeight: '100vh' }}>
      {
        farm !== undefined
          ? <OrderForm farm={farm} />
          : <Result
            status="404"
            title="Exploitation non trouvée"
            subTitle="Désolé, nous n'avons pas trouvé cette exploitation."
          />
      }
    </Content>
  </Layout>
}

export default PublicForm