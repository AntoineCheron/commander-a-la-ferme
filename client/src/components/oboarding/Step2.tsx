import React, { useMemo, useState, useEffect } from 'react'

import BaseStepLayout from './BaseStepLayout'
import { Form, Result, Alert } from 'antd'
import FarmForm from '../my_farm/FarmForm'
import OnboardingService from '../../services/OnboardingService'
import { useHistory } from 'react-router-dom'
import { isAxiosError } from '../../errors'

const Step2: React.FC<{}> = () => {
  const history = useHistory()
  const onboardingService = useMemo(() => new OnboardingService(), [])
  const [form] = Form.useForm()
  const disableNext = useMemo(() => false, [])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>()
  const [success, setSuccess] = useState<boolean>()

  const saveFarmData = () => {
    setIsLoading(true)
    const { name, telephone, address, paymentMethods, description } = form.getFieldsValue(true)
    onboardingService.complete({ name, telephone, address, paymentMethods: paymentMethods || [], description })
      .then(() => setSuccess(true))
      .catch((error) => { setError(error); setSuccess(false); })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { if (success === true) { setTimeout(() => history.push('/app/stock'), 1000) } }, [history, success])

  if (error && isAxiosError(error) && error?.response?.status === 401) {
    throw error
  }

  return <BaseStepLayout title="Informations de votre exploitation" onNext={saveFarmData} disableNext={disableNext} nextLabel='Confirmer' isLoading={isLoading} >
    {(() => {
      if (success === undefined || success === false) {
        return <>
          <FarmForm form={form} />
          <ErrorComponent error={error} success={success} />
        </>
      } else {
        return <Result status="success" title="Exploitation créée avec succès" />
      }
    })()
    }
  </BaseStepLayout>
}

const ErrorComponent: React.FC<{ error?: Error, success?: boolean }> = ({ error, success }) => {
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

export default Step2