import React, { FunctionComponent, useState, useEffect } from 'react'
import { Layout, Result, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import AuthService from '../services/AuthService'
import { useHistory } from 'react-router-dom'

const LogoutPage: FunctionComponent<{}> = () => {

  const [errorMessage, setErrorMessage] = useState<string>()
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    AuthService.logout()
      .then(() => setSuccess(true))
      .catch(setErrorMessage)
  }, [])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Content style={{ paddingTop: '80px' }}>
        {(() => {
          if (errorMessage !== undefined) {
            return <LogoutError errorMessage={errorMessage} />
          } else if (success) {
            return <SuccesfulLogout />
          } else {
            return <LogoutInProgress />
          }
        })()}
      </Layout.Content>
    </Layout>
  )
}

const SuccesfulLogout: FunctionComponent<{}> = () => {
  const history = useHistory()
  setTimeout(() => history.push('/app/commandes'), 1300)

  return <Result
    status="success"
    title="Vous avez été déconnecté avec succès"
    subTitle="Nous allons vous rediriger vers la page de connexion rapidement..."
  />
}

const LogoutError: FunctionComponent<{ errorMessage: string }> = ({ errorMessage }) => {
  return <Result
    status="error"
    title="Vous avez été déconnecté avec succès"
    subTitle={errorMessage}
  />
}

const loadingIcon = <LoadingOutlined style={{ fontSize: 64 }} spin />
const LogoutInProgress: FunctionComponent<{}> = () =>
  <Result
    icon={<Spin indicator={loadingIcon} />}
    title="Déconnexion en cours..."
  />

export default LogoutPage