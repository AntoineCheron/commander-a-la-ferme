import axios from 'axios'

import AuthService from './AuthService'

import { API_URL } from '../config'

export default class Http {
  public static instance () {
    return axios.create({
      baseURL: API_URL,
      headers: { Authorization: AuthService.getToken() }
    })
  }
}
