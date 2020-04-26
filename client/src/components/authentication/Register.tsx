import React, { FunctionComponent, useState, useMemo } from 'react'
import { Col, Form, Input, Button, Layout, Row, Card, Result, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Store } from 'antd/lib/form/interface'
import AuthService from '../../services/AuthService'
import { useHistory } from 'react-router-dom'

const RegisterPage: FunctionComponent<{}> = () => {

  const [errorMessage, setErrorMessage] = useState<string>()
  const [success, setSuccess] = useState(false)

  const onFinish = (values: Store) => {
    AuthService.register(values.username, values.password)
      .then(() => setSuccess(true))
      .catch(setErrorMessage)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Content style={{ paddingTop: '80px' }}>
        {success
          ? <SuccesfulLogin />
          : <RegisterCard register={onFinish} errorMessage={errorMessage} />
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
    title="Votre compte a été créé avec succès"
    subTitle="Nous allons vous rediriger vers la page d'accueil rapidement..."
  />
}

const RegisterCard: FunctionComponent<{ errorMessage?: string, register: (values: Store) => void }> = ({ register, errorMessage }) => {

  const [username, setUsername] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [confirmPassword, setConfirmPassword] = useState<string>()

  const usernameValidationError: InputValidation = useMemo(() => {
    if (username === undefined || username === '') {
      return { status: '', label: "Le nom d'utilisateur est requis" }
    } else if (username.length < 4) {
      return { status: 'error', label: 'Votre nom d\'utilisateur doit faire au moins 4 caractères' }
    } else {
      return { status: 'success', label: '' }
    }
  }, [username])

  const passwordValidationError: InputValidation = useMemo(() => {
    if (password === undefined || password === '') {
      return { status: '', label: 'Le mot de passe est requis' }
    } else if (password.length < 6) {
      return { status: 'error', label: 'Votre mot de passe doit faire au moins 6 caractères' }
    } else {
      return { status: 'success', label: '' }
    }
  }, [password])

  const confirmPasswordValidationError: InputValidation = useMemo(() => {
    if (confirmPassword === undefined || confirmPassword === '') {
      return { status: '', label: 'Merci de confirmer le mot de passe' }
    } else if (confirmPassword !== password) {
      return { status: 'error', label: 'Les deux mots de passe doivent coïncider' }
    } else {
      return { status: 'success', label: '' }
    }
  }, [confirmPassword, password])

  const canValidate: boolean = useMemo(() => usernameValidationError.status === 'success' && passwordValidationError.status === 'success' && confirmPasswordValidationError.status === 'success', [usernameValidationError, passwordValidationError, confirmPasswordValidationError])

  return (
    <Row>
      <Col span={10} offset={7}>
        <Card title="Inscription">

          <Form
            name="normal_register"
            initialValues={{ remember: true }}
            onFinish={register}
          >
            <Form.Item
              name="username"
              required
              validateStatus={usernameValidationError.status}
              help={usernameValidationError?.label}
              hasFeedback
            >
              <Input value={username} onChange={e => setUsername(e.target.value)} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nom d'utilisateur" />
            </Form.Item>
            <Form.Item
              required
              validateStatus={passwordValidationError.status}
              help={passwordValidationError?.label}
              hasFeedback
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={['password']}
              hasFeedback
              required
              validateStatus={confirmPasswordValidationError.status}
              help={confirmPasswordValidationError?.label}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </Form.Item>

            {errorMessage && <Form.Item>
              <Typography.Text type="danger">{errorMessage}</Typography.Text>
            </Form.Item>
            }

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button" style={{ marginRight: '8px' }} disabled={!canValidate}>
                Créer mon compte
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row >
  )
}

type InputValidation = { status: '' | 'error' | 'success', label?: string }

export default RegisterPage