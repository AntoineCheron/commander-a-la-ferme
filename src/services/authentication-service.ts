import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { User, PublicUser } from '../models'
import { WrongCredentialsException } from '../error'

type BearerToken = string

const AUTH_SECRET = 'fdfbb8b9-8db4-43b9-9f7c-a15b6d9423c9'
const SIGNIN_ALGORITHM_OPTIONS: jwt.SignOptions = {
  algorithm: 'HS256',
  expiresIn: '8h'
}

export default class AuthenticationService {
  private static users: User[] = [
    new User('user-1', 'test', 'test', 'Bergerie de Bubertre')
  ]

  private static rejectedTokens: string[] = []

  static login (
    username: string,
    password: string
  ): { token: BearerToken; user: PublicUser } {
    const user = this.users.find(
      user => user.username === username && user.password === password
    )

    if (user) {
      const token = jwt.sign(
        Object.assign({}, user),
        AUTH_SECRET,
        SIGNIN_ALGORITHM_OPTIONS
      )
      return {
        token: 'Bearer ' + token,
        user: user.publicRepresentation()
      }
    } else {
      throw new WrongCredentialsException()
    }
  }

  static rejectToken (token: BearerToken) {
    this.rejectedTokens.push(token.replace('Bearer ', ''))
  }

  static verifyToken (token: BearerToken): Promise<User> {
    return new Promise(function (resolve, reject) {
      jwt.verify(token, AUTH_SECRET, function (err, decoded) {
        if (err) {
          reject(err)
        } else {
          resolve(decoded as User)
        }
      })
    })
  }

  static withAuth (
    callback: (req: Request, res: Response, user: User) => void
  ): (req: Request, res: Response) => void {
    return this.withAuthOrElse(callback, (_, res) =>
      res.redirect(401, '/api/login')
    )
  }

  static withAuthOpt<T> (
    callback: (req: Request, res: Response, user?: User) => T
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
      }

      return callback(req, res, undefined)
    }
  }

  static withAuthOrElse<T> (
    callback: (req: Request, res: Response, user: User) => void,
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
