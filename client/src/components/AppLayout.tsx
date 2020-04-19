import React, { FunctionComponent } from 'react'
import { Layout } from 'antd'

import Navbar from './Navbar'

const { Content } = Layout

const AppLayout: FunctionComponent<{}> = ({ children }) =>
  <Layout>
    <Navbar />
    <Content style={{ padding: '30px 50px', minHeight: 'calc(100vh - 66px)' }}>
      {children}
    </Content>
  </Layout>

export default AppLayout