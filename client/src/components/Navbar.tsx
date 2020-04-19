import React, { useMemo, FunctionComponent } from 'react'
import { useHistory } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
  FormOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  ReconciliationOutlined
} from '@ant-design/icons'
import { ClickParam } from 'antd/lib/menu'
import AuthService from '../services/AuthService'

const { Header } = Layout

const Navbar: FunctionComponent<{}> = () => {
  const history = useHistory()
  const current = useMemo(() => {
    const currentPath = window.location.pathname.slice(5)
    if (currentPath === '' || currentPath.includes('commande')) {
      return 'commandes'
    } else {
      return currentPath
    }
  }, [])

  const onClick = (e: ClickParam) => {
    if (e.key === 'form') {
      const formUrl = `${window.location.origin}/${encodeURI(AuthService.getCurrentUser()?.farmName || 'error')}`
      window.open(formUrl, '_blank')
    } else {
      history.push(`/app/${e.key}`)
    }
  }

  return (
    <Header style={{ background: 'white' }}>
      <Menu selectedKeys={[current]} mode='horizontal' onClick={onClick} style={{ display: 'flex', justifyContent: 'center' }}>

        <Menu.Item key='commandes'>
          <ShoppingCartOutlined /> Commandes
          </Menu.Item>

        <Menu.Item key='stock'>
          <ReconciliationOutlined /> Stock
        </Menu.Item>

        <Menu.Item key='form'>
          <FormOutlined /> Formulaire de commande
        </Menu.Item>

        <Menu.Item key='logout'>
          <LogoutOutlined /> Se déconnecter
        </Menu.Item>

      </Menu>
    </Header>)
}

export default Navbar