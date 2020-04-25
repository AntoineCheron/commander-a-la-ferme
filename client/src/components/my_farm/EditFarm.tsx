import React, { useState, FunctionComponent, useMemo, useEffect } from 'react'
import { Modal, Form, Input, Checkbox, Alert, Result } from 'antd'
import { Farm, PAYMENT_METHODS, PaymentMethod } from '../../models'
import { CheckboxOptionType } from 'antd/lib/checkbox'
import FarmService from '../../services/FarmService'

export type EditFarmProps = {
  farmName: string,
  defaultValue?: Farm
  onSuccess: () => void
  onCancel: () => void
}

const EditFarm: FunctionComponent<EditFarmProps> = ({ farmName, defaultValue, onSuccess, onCancel }) => {
  const farmService = useMemo(() => new FarmService(), [])

  const [telephone, setTelephone] = useState<string>(defaultValue?.telephone || '')
  const [address, setAddress] = useState<string>(defaultValue?.address || '')
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(defaultValue?.paymentMethods || [])
  const [description, setDescription] = useState<string>(defaultValue?.description || '')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>()
  const [success, setSuccess] = useState<boolean>()

  const handleOk = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setIsLoading(true)
    farmService.update(farmName, telephone, address, paymentMethods, description)
      .then(() => setSuccess(true))
      .catch((error) => { setError(error); setSuccess(false); })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { if (success === true) { setTimeout(() => onSuccess(), 1000) } }, [success])

  return (
    <div>
      <Modal
        title="Modifier les informations de mon exploitation"
        visible={true}
        onOk={handleOk}
        onCancel={onCancel}
        width={700}
        cancelText='Annuler'
        okText='Modifier'
        confirmLoading={isLoading}
      >
        {(() => {
          if (success === undefined || success === false) {
            return <><Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} layout="horizontal">

              <Form.Item label="Numéro de téléphone" rules={[{ required: true }]}>
                <Input placeholder="06.07.07.07.07" value={telephone} onChange={e => setTelephone(e.target.value)} />
              </Form.Item>

              <Form.Item label="Adresse postale" rules={[{ required: true }]}>
                <Input placeholder="69 rue du Chemin Vert" value={address} onChange={e => setAddress(e.target.value)} />
              </Form.Item>

              <Form.Item label="Moyens de paiement" rules={[{ required: true }]}>
                <Checkbox.Group
                  options={PAYMENT_METHODS.reduce((acc, paymentMethod) => { acc.push({ label: paymentMethod, value: paymentMethod }); return acc; }, [] as CheckboxOptionType[])}
                  value={paymentMethods}
                  onChange={values => setPaymentMethods(values as PaymentMethod[])}
                />
              </Form.Item>

              <Form.Item label="Description" rules={[{ required: true }]}>
                <Input.TextArea placeholder="Décrivez votre exploitation et votre processus de commande ici." value={description} onChange={e => setDescription(e.target.value)} />
              </Form.Item>

            </Form>

              {
                (error || success === false) && <Alert
                  message="Erreur"
                  description={error?.message || 'Une erreur inconnue s\'est produite'}
                  type="error"
                  showIcon />
              }</>
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