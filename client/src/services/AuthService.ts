import { User } from '../models'

export default class AuthService {
  static isAuthenticated (): boolean {
    return this.getCurrentUser() !== undefined
  }

  static getCurrentUser (): User | undefined {
    const user = localStorage.getItem('user')
    if (user !== null) {
      return JSON.parse(user) as User
    } else {
      return undefined
    }
  }

  static async login (username: string, password: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (username === 'test' && password === 'test') {
        this.setConnectedUser(testUser)
        resolve()
      } else {
        reject(
          "Le nom d'utilisateur ou le mot de passe est incorrect. Essayez test et test pour cette démo."
        )
      }
    })
  }

  static logout (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      localStorage.removeItem('user')
      setTimeout(() => resolve(), 600)
    })
  }

  private static setConnectedUser (user: User): void {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

const testUser: User = {
  id: '1',
  username: 'Test',
  farmName: 'Bergerie de Bubertre'
}
