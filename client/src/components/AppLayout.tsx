import React, { FunctionComponent } from 'react'
import { Layout } from 'antd'

import Navbar from './Navbar'

const { Content } = Layout

const AppLayout: FunctionComponent<{}> = ({ children }) =>
  <Layout>
    <Navbar />
    <Content>
      {children}
    </Content>
  </Layout>

export default AppLayout