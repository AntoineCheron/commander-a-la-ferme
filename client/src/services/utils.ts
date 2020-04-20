import { User } from '../models'
import AuthService from './AuthService'
import { AuthenticationRequiredException } from '../errors'

export function withUser<T> (f: (user: User) => T) {
  const user = AuthService.getCurrentUser()
  if (user !== undefined) {
    return f(user)
  } else {
    throw new AuthenticationRequiredException()
  }
}
