import React, { useState, useCallback, useEffect, ReactNode } from 'react'
import { AxiosError } from 'axios'

import ErrorResult from './ErrorResult'
import Loader from './Loader'

type Props<T> = {
  fct: () => Promise<T>
  children: (t: T) => ReactNode
  loadTitle?: string
  errorTitle?: string
  errorSubTitle?: string
  errorExtra?: ReactNode
  loading?: () => JSX.Element
}

export default function Fetch<T>({ fct, children, loading, errorTitle, errorSubTitle, loadTitle, errorExtra }: Props<T>) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AxiosError>()
  const [data, setData] = useState<T>()

  const resfresh = useCallback(() => {
    setIsLoading(true)
    fct()
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => resfresh(), [])

  if (isLoading) {
    return loading ? loading() : <Loader title={loadTitle || "Chargement en cours..."} />
  } else if (error) {
    return <ErrorResult error={error} title={errorTitle || "Erreur iconnue"} subtitle={errorSubTitle} />
  } else if (data !== undefined) {
    return <>{children(data)}</>
  } else {
    return <ErrorResult title="Une erreur inconnue s'est produite. Essayez de recharger la page." extra={errorExtra} />
  }
}