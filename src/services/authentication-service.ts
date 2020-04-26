import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'

import {
  User,
  PublicUser,
  UserNotOnboarded,
  UserWithPassword,
  UserNotOnboardedWithPassword
} from '../models'
import {
  WrongCredentialsException,
  BusinessRuleEnforced,
  NotFound,
  UnknownUserException
} from '../error'

type BearerToken = string

const AUTH_SECRET = 'fdfbb8b9-8db4-43b9-9f7c-a15b6d9423c9'
const SIGNIN_ALGORITHM_OPTIONS: jwt.SignOptions = {
  algorithm: 'HS256',
  expiresIn: '8h'
}

export default class AuthenticationService {
  private static users: UserWithPassword[] = [
    new UserWithPassword('user-1', 'test', 'test', 'Bergerie de Bubertre')
  ]

  private static usersNotOnboarded: UserNotOnboardedWithPassword[] = [
    new UserNotOnboardedWithPassword('user-2', 'AntoineCheron', 'antoine')
  ]

  private static rejectedTokens: string[] = []

  static generateToken (user: User | UserNotOnboarded): BearerToken {
    return (
      'Bearer ' +
      jwt.sign(Object.assign({}, user), AUTH_SECRET, SIGNIN_ALGORITHM_OPTIONS)
    )
  }

  static login (
    username: string,
    password: string
  ): { token: BearerToken; user: PublicUser } {
    const user =
      this.users
        .find(user => user.username === username && user.password === password)
        ?.toUser() ||
      this.usersNotOnboarded
        .find(user => user.username === username && user.password === password)
        ?.toUserNotOnboarded()

    if (user) {
      const token = this.generateToken(user)
      return {
        token,
        user: user
      }
    } else {
      throw new WrongCredentialsException()
    }
  }

  static register (
    username: string,
    password: string
  ): { token: string; user: UserNotOnboarded } {
    if (this.users.find(user => user.username === username) === undefined) {
      const newUser = new UserNotOnboardedWithPassword(
        `user-${uuid()}`,
        username,
        password
      )
      this.usersNotOnboarded.push(newUser)
      const token = this.generateToken(newUser)
      return { token, user: newUser }
    } else {
      throw new BusinessRuleEnforced(
        "Ce nom d'utilisateur n'est pas disponible."
      )
    }
  }

  static rejectToken (token: BearerToken) {
    this.rejectedTokens.push(token.replace('Bearer ', ''))
  }

  static verifyToken (token: BearerToken): Promise<UserNotOnboarded | User> {
    return new Promise(function (resolve, reject) {
      jwt.verify(token, AUTH_SECRET, function (err, decoded) {
        if (err) {
          reject(err)
        } else if (decoded === undefined) {
          reject(new WrongCredentialsException('Inconsistent token'))
        } else {
          const user = User.from(decoded) || UserNotOnboarded.from(decoded)
          if (user === undefined) {
            reject(new WrongCredentialsException('Inconsistent token'))
          } else if (AuthenticationService.userDoesNotExist(user.username)) {
            reject(new UnknownUserException())
          } else {
            resolve(user)
          }
        }
      })
    })
  }

  static completeOnboarding (
    username: string,
    farmName: string
  ): { token: string; user: User } {
    const user = this.usersNotOnboarded.find(user => user.username === username)
    if (user !== undefined) {
      const index = this.usersNotOnboarded.indexOf(user)
      this.usersNotOnboarded.splice(index, 1)
      const updatedUser = new UserWithPassword(
        user.id,
        user.username,
        user.password,
        farmName
      )
      this.users.push(updatedUser)

      const token = this.generateToken(updatedUser)
      return { token, user: updatedUser.toUser() }
    } else {
      throw new NotFound()
    }
  }

  private static userDoesNotExist (username: string): boolean {
    return (
      this.usersNotOnboarded.find(user => user.username === username) ===
        undefined &&
      this.users.find(user => user.username === username) === undefined
    )
  }

  static withAuthBeforeOnboarding (
    callback: (req: Request, res: Response, user: UserNotOnboarded) => void
  ): (req: Request, res: Response) => void {
    return this.withAuthOrElse(callback, (_, res) =>
      res.redirect(401, '/api/login')
    )
  }

  static withAuth (
    callback: (req: Request, res: Response, user: User) => void
  ): (req: Request, res: Response) => void {
    return this.withAuthBeforeOnboarding((req, res, userMaybeNotOnboarded) => {
      if (userMaybeNotOnboarded instanceof User) {
        return callback(req, res, userMaybeNotOnboarded)
      } else {
        res.status(403).json({
          errorKey: 'USER_NOT_ONBOARDED',
          message: "Le parcours d'onboarding n'a pas encore été complété"
        })
      }
    })
  }

  static withAuthOpt<T> (
    callback: (req: Request, res: Response, user?: UserNotOnboarded) => T
  ): (req: Request, res: Response) => void {
    return (req: Request, res: Response) => {
      const authHeader = req.header('Authorization')

      if (authHeader !== undefined) {
        const authToken = authHeader
          ? authHeader.replace('Bearer ', '')
          : undefined

        if (authToken && this.rejectedTokens.includes(authToken)) {
          return res.redirect(401, '/api/login')
        } else if (authToken !== undefined) {
          return this.verifyToken(authToken)
            .then(user => callback(req, res, user))
            .catch(() => callback(req, res, undefined))
        }
      } else {
        return callback(req, res, undefined)
      }
    }
  }

  static withAuthOrElse<T> (
    callback: (req: Request, res: Response, user: UserNotOnboarded) => void,
    orElse: (req: Request, res: Response) => T
  ): (req: Request, res: Response) => void {
    return this.withAuthOpt((req, res, user) => {
      if (user) {
        callback(req, res, user)
      } else {
        orElse(req, res)
      }
    })
  }
}
