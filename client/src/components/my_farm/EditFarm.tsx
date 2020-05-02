import React, { useState, FunctionComponent, useMemo, useEffect } from 'react'
import { Modal, Form, Alert, Result, Button } from 'antd'
import { Farm } from '../../models'
import FarmService from '../../services/FarmService'
import FarmForm from './FarmForm'

export type EditFarmProps = {
  farmName: string,
  defaultValue?: Farm
  onSuccess: () => void
  onCancel: () => void
}

const EditFarm: FunctionComponent<EditFarmProps> = ({ farmName, defaultValue, onSuccess, onCancel }) => {
  const farmService = useMemo(() => new FarmService(), [])
  const [form] = Form.useForm()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>()
  const [success, setSuccess] = useState<boolean>()

  const handleOk = () => {
    setIsLoading(true)
    const { telephone, address, paymentMethods, description } = form.getFieldsValue()
    farmService.update(farmName, telephone, address, paymentMethods, description)
      .then(() => setSuccess(true))
      .catch((error) => { setError(error); setSuccess(false); })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { if (success === true) { setTimeout(() => onSuccess(), 1000) } }, [success, onSuccess])

  return (
    <div>
      <Modal
        title="Modifier les informations de mon exploitation"
        visible={true}
        onOk={handleOk}
        width={700}
        footer={[
          <Button key="back" onClick={onCancel} disabled={isLoading || error !== undefined || success} >
            Annuler
          </Button>,
          <Button key="submit" type="primary" loading={isLoading} onClick={handleOk} disabled={isLoading || error !== undefined || success}>
            Modifier
          </Button>,
        ]}
      >
        {(() => {
          if (success === undefined || success === false) {
            return <><FarmForm
              form={form}
              defaultValue={defaultValue}
              exclude={['name']}
            />

              {
                (error || success === false) && <Alert
                  message="Erreur"
                  description={error?.message || 'Une erreur inconnue s\'est produite'}
                  type="error"
                  showIcon />
              }
            </>
          } else {
            return <Result status="success" title="Informations mises à jour avec succès" />
          }
        })()
        }
      </Modal>
    </div>
  )
}

export default EditFarm