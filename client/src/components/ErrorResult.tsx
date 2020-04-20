import React, { FunctionComponent, ReactNode } from 'react'
import { Result } from 'antd'

import { AxiosError } from 'axios'

type Props = { error?: AxiosError, title: string, subtitle?: string, subtitleFallback?: string, extra?: ReactNode }

const ErrorResult: FunctionComponent<Props> = ({ error, title, subtitle, subtitleFallback, extra }) => <Result
  status={toResultStatus(error)}
  title={title}
  subTitle={subtitle || error?.message || subtitleFallback}
  extra={extra}
/>

function toResultStatus(error?: AxiosError): '403' | '404' | '500' | 'error' {
  if (error?.code !== undefined && ["403", "404", "500"].includes(error.code)) {
    return error.code as '403' | '404' | '500'
  } else {
    return 'error'
  }
}

export default ErrorResult