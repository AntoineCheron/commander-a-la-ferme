import React, { FunctionComponent, useState, useEffect } from 'react'
import { Layout, Result } from 'antd'
import { useHistory } from 'react-router-dom'

import Loader from '../components/Loader'
import AuthService from '../services/AuthService'

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
            return <Loader title='Déconnexion en cours...' />
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

export default LogoutPage