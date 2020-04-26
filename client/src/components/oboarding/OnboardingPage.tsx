import React from 'react'
import { useHistory, Route, Switch, Redirect } from 'react-router-dom'
import { Result } from 'antd'

import Step1 from './Step1'
import Step2 from './Step2'
import { useUserContext } from '../../context/UserContext'

const OnboardingPage: React.FC<{}> = () => {
  const history = useHistory()
  const user = useUserContext()

  if (user?.farmName === undefined) {
    return <Switch>

      <Route path={'/app/onboarding/etape-1'} exact>
        <Step1 />
      </Route>

      <Route path={'/app/onboarding/etape-2'} exact>
        <Step2 />
      </Route>

      <Route path={'/app/onboarding'}><Redirect to={'/app/onboarding/etape-1'} /></Route>
    </Switch>
  } else {
    history.goBack()
    return <Result
      status="info"
      title="Parcours d'onboarding déjà complété"
      subTitle="Nous allons vous rediriger vers la page de précédente rapidement..."
    />
  }
}

export default OnboardingPage