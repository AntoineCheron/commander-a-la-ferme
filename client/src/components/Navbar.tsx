import React, { FunctionComponent } from 'react'
import { useHistory } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
  LoginOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  ReconciliationOutlined
} from '@ant-design/icons'

const { Header } = Layout

const Navbar: FunctionComponent<{}> = () => {
  const history = useHistory()
  const current = window.location.pathname.slice(1) || 'commandes'

  return (
    <Header style={{ background: 'white', padding: 0 }}>
      <Menu selectedKeys={[current]} mode='horizontal' onClick={e => history.push(`/${e.key}`)}>

        <Menu.Item key='commandes'>
          <ShoppingCartOutlined /> Commandes
          </Menu.Item>

        <Menu.Item key='stock'>
          <ReconciliationOutlined /> Stock
        </Menu.Item>

        <Menu.Item key='login'>
          <LoginOutlined /> Se connecter
          </Menu.Item>

        <Menu.Item key='logout'>
          <LogoutOutlined /> Se déconnecter
        </Menu.Item>

      </Menu>
    </Header>)
}

export default Navbar