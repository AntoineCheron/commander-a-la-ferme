import React, { FunctionComponent, ReactNode } from 'react'
import { Result } from 'antd'

import { AxiosError } from 'axios'

type Props = { error?: Error, title: string, subtitle?: string, subtitleFallback?: string, extra?: ReactNode }

const ErrorResult: FunctionComponent<Props> = ({ error, title, subtitle, subtitleFallback, extra }) => <Result
  status={toResultStatus(error)}
  title={title}
  subTitle={subtitle || error?.message || subtitleFallback}
  extra={extra}
/>

function toResultStatus(error?: Error): '403' | '404' | '500' | 'error' {
  if (error !== undefined && isAxiosError(error) && error?.code !== undefined && ["403", "404", "500"].includes(error.code)) {
    return error.code as '403' | '404' | '500'
  } else {
    return 'error'
  }
}

function isAxiosError(error: Error): error is AxiosError {
  return true
}

export default ErrorResult