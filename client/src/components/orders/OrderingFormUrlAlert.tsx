import React, { FunctionComponent } from 'react'
import { Alert } from 'antd'
import AuthService from '../../services/AuthService'

const LOCAL_STORAGE_VISIBLE_STATE_KEY = 'show-ordering-form-url'

const OrderingFormUrlAlert: FunctionComponent<{}> = () => {
  const visible = localStorage.getItem(LOCAL_STORAGE_VISIBLE_STATE_KEY) === null

  const url = `${window.location.origin}/${encodeURI(AuthService.getCurrentUser()?.farmName || 'error')}`

  if (visible) {
    return <Alert
      type='info'
      closeText='Ne plus afficher'
      onClose={() => localStorage.setItem(LOCAL_STORAGE_VISIBLE_STATE_KEY, 'false')}
      message={`Pour que vos clients passent commande, partagez leur le lien suivant : ${url}. Sinon, vous pouvez remplir le formulaire de commande vous-même.`}
    />
  } else { return null }
}

export default OrderingFormUrlAlert