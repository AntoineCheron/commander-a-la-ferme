import React from 'react'
import { Alert, Typography } from 'antd'
import { useHistory } from 'react-router-dom'

import BaseStepLayout from './BaseStepLayout'

const { Paragraph } = Typography

const Step1: React.FC<{}> = () => {
  const history = useHistory()

  return <BaseStepLayout title="Bienvenue !" onNext={() => history.push('/app/onboarding/etape-2')}>
    <Paragraph>Bonjour et bienvenue sur Commander à la ferme.</Paragraph>
    <Paragraph>Cette application vous permet d'offrir un lien à vos clients pour qu'ils commandent vos produits en ligne.</Paragraph>
    <Paragraph>Vous pourrez ainsi suivre vos commandes et l'évolution de votre stock.</Paragraph>
    <Paragraph>Vos clients ne vous commanderont ainsi pas de produit que vous n'avez plus.</Paragraph>
    <Paragraph>Pour commencer, nous avons besoin de quelques informations sur votre exploitation pour les afficher à vos clients lorsqu'ils commanderont.</Paragraph>

    <Alert
      message="Message de l'auteur de l'application"
      description="Bonjour, je m'appelle Antoine Cheron et j'ai développé cette application pour vous aider dans votre quotidien à gérer et suivre vos commandes. Vous pouvez me contacter par email à cheron.antoine@gmail.com pour me soumettre vos suggestions afin que cette application réponde au mieux à votre besoin. Faire ce genre d'application est mon métier et j'ai fait celle-ci comme projet personnel. Cette application est totalement gratuite. J'espère qu'elle vous rendra service :)."
      type="info"
      showIcon
    />
  </BaseStepLayout>
}

export default Step1