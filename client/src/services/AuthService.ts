import { User } from '../models'

export default class AuthService {
  static getCurrentUser (): User | undefined {
    const user = localStorage.getItem('user')
    if (user !== null) {
      return JSON.parse(user) as User
    } else {
      return undefined
    }
  }
}
