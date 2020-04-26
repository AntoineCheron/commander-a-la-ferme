import React, { FunctionComponent } from 'react'
import { Form, Input, Checkbox } from 'antd'
import { Farm, PAYMENT_METHODS } from '../../models'
import { CheckboxOptionType } from 'antd/lib/checkbox'
import { FormInstance } from 'antd/lib/form'

export type EditFarmProps = {
  form: FormInstance
  defaultValue?: Farm,
  exclude?: FarmFormInput[]
}

export type FarmFormInput = 'name' | 'telephone' | 'address' | 'paymentMethods' | 'description'

const FarmForm: FunctionComponent<EditFarmProps> = ({ form, exclude, defaultValue }) => {
  return (
    <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} layout="horizontal">

      {!exclude?.includes('name') && <Form.Item name="name" label="Nom" rules={[{ required: true }]}>
        <Input placeholder="Le nom de votre exploitation" />
      </Form.Item>}

      {!exclude?.includes('telephone') && <Form.Item name="telephone" label="Numéro de téléphone" rules={[{ required: true }]}>
        <Input placeholder="06.07.07.07.07" />
      </Form.Item>}

      {!exclude?.includes('address') && <Form.Item name="address" label="Adresse postale" rules={[{ required: true }]}>
        <Input placeholder="69 rue du Chemin Vert" />
      </Form.Item>}

      {!exclude?.includes('paymentMethods') && <Form.Item name="paymentMethods" label="Moyens de paiement" rules={[{ required: true }]}>
        <Checkbox.Group
          options={PAYMENT_METHODS.reduce((acc, paymentMethod) => { acc.push({ label: paymentMethod, value: paymentMethod }); return acc; }, [] as CheckboxOptionType[])}
        />
      </Form.Item>}

      {!exclude?.includes('description') && <Form.Item name="description" label="Description" rules={[{ required: true }]}>
        <Input.TextArea placeholder="Décrivez votre exploitation et votre processus de commande ici." />
      </Form.Item>}

    </Form>
  )
}

export default FarmForm