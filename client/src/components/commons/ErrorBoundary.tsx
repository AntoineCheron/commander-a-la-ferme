import React from 'react'

import { isApiError, isAxiosError, ERROR_KEYS } from '../../errors'
import { Redirect } from 'react-router-dom'
import ErrorResult from './ErrorResult'
import AuthService from '../../services/AuthService'

type State = {
  error?: Error
}

type Props = {}

export default class ErrorBoundary extends React.Component<Props, State> {

  constructor(props: React.Props<Props>) {
    super(props)
    this.state = {}
  }

  static getDerivedStateFromError(error: Error | null) {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  render() {
    const error = this.state.error

    if (error && isAxiosError(error)) {

      const title = error.name || "Erreur venant du serveur"
      const subtitle = isApiError(error.response?.data) ? error.response?.data?.description : error?.message

      if (error.response?.status === 401) {
        AuthService.removeUser()
        AuthService.removeToken()
        return <Redirect to="/app/login" />
      } else if (isApiError(error.response?.data || {})) {
        const apiError = error.response?.data
        if (apiError.key === ERROR_KEYS.USER_NOT_ONBOARDED) {
          return <Redirect to="/app/onboarding" />
        }
      }

      return <ErrorResult title={title} error={error} subtitle={subtitle} />
    } else if (error) {
      return <ErrorResult title="Erreur" subtitle={error?.message} />
    } else {
      return this.props.children
    }
  }

}
