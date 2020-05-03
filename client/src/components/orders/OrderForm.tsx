import React, { useState, FunctionComponent, useMemo } from 'react'
import { Button, Card, Col, Select, Form, Input, Row, Typography, Result, Spin } from 'antd'
import { CheckOutlined } from '@ant-design/icons'

import { Farm, OrderableItem, PaymentMethod } from '../../models'
import FarmCard from '../my_farm/FarmCard'
import OrderFormItemsSelector from './OrderFormItemsSelector'
import OrderSummary from './OrderSummary'
import OrderService from '../../services/OrderService'
import ErrorResult from '../commons/ErrorResult'

const { Title } = Typography

type Selection = { [category: string]: OrderableItem[] }

const OrderForm: FunctionComponent<{ farm: Farm }> = ({ farm }) => {
  const [validated, setValidated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  const [fullname, setFullname] = useState<string>()
  const [telephone, setTelephone] = useState<string>()
  const [email, setEmail] = useState<string>()
  const [address, setAddress] = useState<string>()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>()
  const [customerComment, setCustomerComment] = useState<string>()

  const orderService = useMemo(() => new OrderService(), [])

  const initialSelection: Selection = farm.inventory.map(item => {
    return {
      id: item.id,
      title: item.title,
      category: item.category,
      price: item.price,
      remaining: (item.remaining - (item.ordered || 0)), // 02/05/2020 (item.ordered || 0) is used because item.ordered is not supported by the backend yet
      amount: 0
    }
  }).reduce((acc, item) => {
    acc[item.category] = [...(acc[item.category] || []), item]
    return acc
  }, {} as Selection)

  const [selection, setSelection] = useState<Selection>(initialSelection)
  const selectedItems = useMemo(() => Object.values(selection).flat(1).filter(item => item.amount !== 0), [selection])

  const validateOrder = () => {
    setIsLoading(true)
    if (fullname && telephone && address && paymentMethod) {
      const order = {
        fullname,
        telephone,
        email,
        address,
        paymentMethod,
        customerComment,
        items: selectedItems
      }

      orderService.create(farm.name, order)
        .then(() => {
          setValidated(true)
        })
        .catch((error) => {
          setValidated(false)
          setError(error)
        })
        .finally(() => setIsLoading(false))
    }
  }

  if (validated) {
    return <OrderSuccessful farm={farm} selection={selectedItems} />
  } else if (error) {
    return <ErrorResult error={error} title="Oups, impossible de passer votre commande" />
  } else {
    return <>
      <Title>Passer commande à {farm.name}</Title>

      <Spin spinning={isLoading}>
        <Row gutter={[16, 16]}>
          <FarmCard farm={farm} />
        </Row>

        <OrderFormItemsSelector selection={selection} setSelection={setSelection} />

        <Title level={3}>Saisie de vos informations personnelles</Title>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="horizontal">

                <Form.Item label="Nom Complet" rules={[{ required: true }]}>
                  <Input placeholder="Gérard Menlbudget" value={fullname} onChange={e => setFullname(e.target.value)} />
                </Form.Item>

                <Form.Item label="Numéro de téléphone" rules={[{ required: true }]}>
                  <Input placeholder="06.07.07.07.07" value={telephone} onChange={e => setTelephone(e.target.value)} />
                </Form.Item>

                <Form.Item label="Adresse e-mail" rules={[{ type: 'email' }]}>
                  <Input placeholder="bugs.bunny@orange.fr" value={email} onChange={e => setEmail(e.target.value)} />
                </Form.Item>

                <Form.Item label="Adresse postale" rules={[{ required: true }]}>
                  <Input placeholder="69 rue du Chemin Vert 01000 Ste Marie s/ Rouana" value={address} onChange={e => setAddress(e.target.value)} />
                </Form.Item>

                <Form.Item label="Moyen de paiement" rules={[{ required: true }]}>
                  <Select placeholder="Choisissez le moyen de paiement avec lequel vous souhaitez régler" value={paymentMethod} onChange={setPaymentMethod}>
                    {farm.paymentMethods.map(paymentMethod =>
                      <Select.Option key={paymentMethod} value={paymentMethod}>{paymentMethod}</Select.Option>)
                    }
                  </Select>
                </Form.Item>

                <Form.Item name="personalComment" label="Commentaire à l'attention de l'exploitation">
                  <Input.TextArea maxLength={1000} value={customerComment} onChange={e => setCustomerComment(e.target.value)} placeholder="Laissez un petit mot ici si vous avez besoin d'ajouter des précisions à votre commande." />
                </Form.Item>

              </Form>
            </Card>
          </Col>
        </Row>

        <OrderSummary selection={selectedItems} farmName={farm.name} />

        <Button type="primary" htmlType="submit" onClick={validateOrder} disabled={selectedItems.length === 0 || !(fullname && telephone && address && paymentMethod)}>
          <CheckOutlined /> Valider ma commande
        </Button>
      </Spin>
    </>
  }
}

const OrderSuccessful: FunctionComponent<{ farm: Farm, selection: OrderableItem[] }> = ({ farm, selection }) => <Result
  status="success"
  title="Commande passée avec succès"
  subTitle={`Votre commande a bien été transmise à ${farm.name}`}
>
  <OrderSummary selection={selection} />
</Result>

export default OrderForm