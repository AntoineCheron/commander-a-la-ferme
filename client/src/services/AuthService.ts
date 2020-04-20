import { User } from '../models'

import Http from './Http'
import { AxiosError } from 'axios'

const TOKEN_LOCAL_STORAGE_KEY = 'Authorization'
const USER_LOCAL_STORAGE_KEY = 'user'

export default class AuthService {
  static isAuthenticated (): boolean {
    return this.getCurrentUser() !== undefined
  }

  static getCurrentUser (): User | undefined {
    const user = localStorage.getItem(USER_LOCAL_STORAGE_KEY)
    if (user !== null) {
      return JSON.parse(user) as User
    } else {
      return undefined
    }
  }

  static async login (username: string, password: string): Promise<void> {
    return Http.instance()
      .post('/login', { username, password })
      .then(result => {
        this.updateToken(result.data.token)
        this.setConnectedUser(result.data.user)
      })
      .catch((error: AxiosError) => error.message) as Promise<void>
  }

  static logout (): Promise<void> {
    return Http.instance()
      .post('/logout')
      .then(() => {
        this.removeToken()
        this.removeUser()
      })
      .catch((error: AxiosError) => error.message) as Promise<void>
  }

  static getToken () {
    return window.localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY)
  }

  static updateToken (token: string) {
    window.localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, token)
  }

  static removeToken () {
    window.localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY)
  }

  static removeUser () {
    window.localStorage.removeItem(USER_LOCAL_STORAGE_KEY)
  }

  static currentTokenWasRefusedByApi () {
    this.removeToken()
  }

  private static setConnectedUser (user: User): void {
    localStorage.setItem('user', JSON.stringify(user))
  }
}
