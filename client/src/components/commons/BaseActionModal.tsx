import React, { useState, useEffect } from 'react'
import { Button, Modal, Result } from 'antd'

import ErrorAlert from './ErrorAlert'
import { isAxiosError } from '../../errors'

type BaseActionModalProps = {
  title: string
  disableOk?: boolean
  closable?: boolean
  visible?: boolean
  f: () => Promise<void>
  callback: () => void
  okLabel?: string
}

const BaseActionModal: React.FC<BaseActionModalProps> = ({ title, children, closable, visible, disableOk, okLabel, f, callback }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>()
  const [success, setSuccess] = useState<boolean>()

  const save = () => {
    setIsLoading(true)
    f()
      .then(() => setSuccess(true))
      .catch((error) => { setError(error); setSuccess(false); })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { if (success === true) { callback() } }, [success])

  if (error && isAxiosError(error) && error?.response?.status === 401) {
    throw error
  }

  return <Modal
    title={title}
    visible={visible || true}
    onOk={save}
    closable={closable || true}
    width={700}
    footer={[
      <Button key="submit" type="primary" loading={isLoading || false} onClick={save} disabled={disableOk || false}>
        {okLabel || 'Ok'}
      </Button>,
    ]}
  >
    {(() => {
      if (success === undefined || success === false) {
        return <>
          {children}
          <ErrorAlert error={error} success={success} />
        </>
      } else {
        return <Result status="success" title="Exploitation créée avec succès" />
      }
    })()
    }
  </Modal>
}

export default BaseActionModal