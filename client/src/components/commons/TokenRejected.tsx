import React from 'react'
import AuthService from '../../services/AuthService'
import { Redirect } from 'react-router-dom'

const TokenRejected: React.FC = () => {
  AuthService.currentTokenWasRefusedByApi()
  return <Redirect to="/app/login" />
}

export default TokenRejected