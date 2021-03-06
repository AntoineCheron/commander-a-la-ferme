import { User } from '../models'

import Http from './Http'

const TOKEN_LOCAL_STORAGE_KEY = 'Authorization'
const USER_LOCAL_STORAGE_KEY = 'user'

export default class AuthService {
  static isAuthenticated (): boolean {
    return this.getToken() !== undefined && this.getToken() !== null
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
    return this.loginOrRegister('login', username, password)
  }

  static async register (username: string, password: string): Promise<void> {
    return this.loginOrRegister('register', username, password)
  }

  private static async loginOrRegister (
    action: string,
    username: string,
    password: string
  ): Promise<void> {
    return Http.instance()
      .post('/' + action, { username, password })
      .then(result => {
        this.updateToken(result.data.token)
        this.setConnectedUser(result.data.user)
      })
  }

  static logout (): Promise<void> {
    return Http.instance()
      .post('/logout')
      .then(() => {})
      .finally(() => {
        this.removeToken()
        this.removeUser()
      })
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

  public static setConnectedUser (user: User): void {
    localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user))
  }
}
