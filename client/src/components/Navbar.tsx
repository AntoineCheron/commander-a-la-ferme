import React, { useMemo, FunctionComponent } from 'react'
import { useHistory } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
  LogoutOutlined,
  ShoppingCartOutlined,
  ReconciliationOutlined
} from '@ant-design/icons'

const { Header } = Layout

const Navbar: FunctionComponent<{}> = () => {
  const history = useHistory()
  const current = useMemo(() => {
    const currentPath = window.location.pathname.slice(1)
    if (currentPath === '') {
      return 'commandes'
    }

    const indexOfSlash = currentPath.indexOf('/')
    return indexOfSlash === -1
      ? currentPath
      : currentPath.slice(0, currentPath.indexOf('/'))
  }, [window.location.pathname])

  return (
    <Header style={{ background: 'white' }}>
      <Menu selectedKeys={[current]} mode='horizontal' onClick={e => history.push(`/${e.key}`)} style={{ display: 'flex', justifyContent: 'center' }}>

        <Menu.Item key='commandes'>
          <ShoppingCartOutlined /> Commandes
          </Menu.Item>

        <Menu.Item key='stock'>
          <ReconciliationOutlined /> Stock
        </Menu.Item>

        <Menu.Item key='logout'>
          <LogoutOutlined /> Se déconnecter
        </Menu.Item>

      </Menu>
    </Header>)
}

export default Navbar