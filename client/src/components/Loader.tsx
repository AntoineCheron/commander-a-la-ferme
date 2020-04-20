import React, { FunctionComponent } from 'react'
import { Result, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const loadingIcon = <LoadingOutlined style={{ fontSize: 64 }} spin />
const Loader: FunctionComponent<{ title: string }> = ({ title }) =>
  <Result
    icon={<Spin indicator={loadingIcon} />}
    title={title}
  />

export default Loader