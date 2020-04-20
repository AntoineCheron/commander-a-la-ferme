import React, { useEffect, useState, FunctionComponent } from 'react'
import { useParams } from 'react-router-dom'
import { Layout, Result } from 'antd'

import OrderForm from '../components/OrderForm'
import ErrorResult from '../components/ErrorResult'
import Loader from '../components/Loader'
import FormService from '../services/FormService'
import { Farm } from '../models'
import { AxiosError } from 'axios'

const { Content } = Layout

const PublicForm: FunctionComponent<{}> = () => {
  const { farmName } = useParams<{ farmName: string }>()
  const [farm, setFarm] = useState<Farm>()
  const [error, setError] = useState<AxiosError>()

  useEffect(() => {
    var isMounted = true
    FormService.getInventoryOfFarm(farmName).then(farm => {
      if (isMounted) { setFarm(farm) }
    }).catch(error => {
      if (isMounted) setError(error)
    })
    return () => { isMounted = false }
  }, [farmName])

  return <Layout>
    <Content style={{ padding: '30px 50px', minHeight: '100vh' }}>
      {
        error !== undefined ? <ErrorResult error={error} title="Exploitation non trouvée" />
          : farm !== undefined ? <OrderForm farm={farm} />
            : <Loader title='Chargement en cours...' />
      }
    </Content>
  </Layout>
}

export default PublicForm