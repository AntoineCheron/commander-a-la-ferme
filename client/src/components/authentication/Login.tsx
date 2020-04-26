import React, { FunctionComponent, useState } from 'react'
import { Col, Form, Input, Button, Layout, Row, Card, Result, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Store } from 'antd/lib/form/interface';
import AuthService from '../../services/AuthService';
import { useHistory } from 'react-router-dom';

const LoginPage: FunctionComponent<{}> = () => {

  const [errorMessage, setErrorMessage] = useState<string>()
  const [success, setSuccess] = useState(false)

  const onFinish = (values: Store) => {
    AuthService.login(values.username, values.password)
      .then(() => setSuccess(true))
      .catch(error => { setErrorMessage(error.response.data.description || error.message); setSuccess(false) })
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Content style={{ paddingTop: '80px' }}>
        {success
          ? <SuccesfulLogin />
          : <NormalLoginCard login={onFinish} errorMessage={errorMessage} />
        }
      </Layout.Content>
    </Layout>
  )
}

const SuccesfulLogin: FunctionComponent<{}> = () => {
  const history = useHistory()
  setTimeout(() => history.push('/app/commandes'), 600)

  return <Result
    status="success"
    title="Vous avez été connecté avec succès"
    subTitle="Nous allons vous rediriger vers la page d'accueil rapidement..."
  />
}

const NormalLoginCard: FunctionComponent<{ errorMessage?: string, login: (values: Store) => void }> = ({ login, errorMessage }) => {
  return (
    <Row>
      <Col span={10} offset={7}>
        <Card title="Connexion">

          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={login}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Merci d\'entrer votre nom d\'utilisateur' }]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nom d'utilisateur" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Merci d\'entrer votre mot de passe' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Mot de passe"
              />
            </Form.Item>

            {errorMessage && <Form.Item>
              <Typography.Text type="danger">{errorMessage}</Typography.Text>
            </Form.Item>
            }

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button" style={{ marginRight: '8px' }}>
                Connexion
              </Button>
              ou <a href="/app/inscription">créer un compte</a>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row >
  )
}

export default LoginPage