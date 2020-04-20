import axios from 'axios'

import AuthService from './AuthService'

export default class Http {
  public static instance () {
    return axios.create({
      baseURL: '/api',
      headers: { Authorization: AuthService.getToken() }
    })
  }
}
