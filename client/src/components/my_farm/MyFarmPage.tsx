import React, { FunctionComponent, useState } from 'react'
import { Typography, Button, Row, Col } from 'antd'
import { EditOutlined } from '@ant-design/icons'

import AppLayout from '../layout/AppLayout'
import FarmService from '../../services/FarmService'
import { useUserContext } from '../../context/UserContext'
import Fetch from '../commons/Fetch'
import FarmCard from './FarmCard'
import EditFarm from './EditFarm'

const { Title, Paragraph } = Typography

const MyFarmPage: FunctionComponent<{}> = () => {
  const user = useUserContext()

  const [isEditing, setIsEditing] = useState(false)

  return (
    <AppLayout>
      <Title>Mon exploitation</Title>
      <Paragraph>Gérez la fiche qui est présentée à vos clients lorsqu'ils passent commande.</Paragraph>

      <Fetch
        fct={() => FarmService.getInventoryOfFarm(user.farmName)}
        errorTitle="Exploitation non trouvée"
        errorSubTitle="Désolé, nous n'avons pas trouvé votre exploitation."
      >
        {(farm) => <>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Button type='primary' onClick={() => setIsEditing(true)}><EditOutlined /> Modifier</Button>
            </Col>

            <Col span={24}>
              <FarmCard farm={farm} />
            </Col>
          </Row>

          {isEditing && <EditFarm farmName={farm.name} defaultValue={farm} onSuccess={() => { setIsEditing(false); setIsEditing(false) }} onCancel={() => setIsEditing(false)} />}
        </>}
      </Fetch>

    </AppLayout>)
}

export default MyFarmPage
