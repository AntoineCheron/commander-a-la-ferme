import React from 'react'
import { Alert } from 'antd'

const ErrorAlert: React.FC<{ error?: Error, success?: boolean }> = ({ error, success }) => {
  if (error || success === false) {
    return <Alert
      message="Erreur"
      description={error?.message || 'Une erreur inconnue s\'est produite'}
      type="error"
      showIcon />
  } else {
    return null
  }
}

export default ErrorAlert