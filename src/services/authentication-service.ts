import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import { Pool } from 'pg'

import { User, PublicUser, UserNotOnboarded } from '../models'
import {
  WrongCredentialsException,
  BusinessRuleEnforced,
  NotFound
} from '../error'

import bcrypt from 'bcryptjs'
import { PsqlUtils } from '../utils'
import Database from './database-service'

type BearerToken = string

const AUTH_SECRET = 'fdfbb8b9-8db4-43b9-9f7c-a15b6d9423c9'
const SIGNIN_ALGORITHM_OPTIONS: jwt.SignOptions = {
  algorithm: 'HS256',
  expiresIn: '8h'
}

export default class AuthenticationService {
  constructor (private pool: Pool) {}

  private generateToken (user: User | UserNotOnboarded): BearerToken {
    return (
      'Bearer ' +
      jwt.sign(Object.assign({}, user), AUTH_SECRET, SIGNIN_ALGORITHM_OPTIONS)
    )
  }

  async login (
    username: string,
    password: string
  ): Promise<{ token: BearerToken; user: PublicUser }> {
    try {
      const res = await this.pool.query({
        text:
          'SELECT id, username, password, farmname FROM users WHERE username = $1;',
        values: [username]
      })

      if (res.rowCount === 1) {
        const row = res.rows[0]
        const isPasswordCorrect = await bcrypt.compare(password, row.password)

        if (isPasswordCorrect) {
          const user = new User(row.id, row.username, row.farmname)
          const token = this.generateToken(user)
          return { token, user: user }
        } else {
          throw new BusinessRuleEnforced('Le mot de passe est incorrect.')
        }
      } else if (res.rowCount === 0) {
        throw new BusinessRuleEnforced("Le nom d'utilisateur est incorrect.")
      } else {
        throw new Error()
      }
    } catch (error) {
      // TODO: manage errors appropriately
      throw error
    }
  }

  async register (
    username: string,
    password: string
  ): Promise<{ token: string; user: UserNotOnboarded }> {
    const hashedPassword = await bcrypt.hash(password, 8)
    const res = await this.pool.query({
      text: `INSERT INTO users(id, username, password) SELECT $1, CAST($2 AS VARCHAR), $3 WHERE NOT EXISTS (SELECT 1 FROM users WHERE username=$2) RETURNING * ;`,
      values: [uuid(), username, hashedPassword]
    })

    if (res.rowCount === 1) {
      const row = res.rows[0]
      const newUser = new UserNotOnboarded(row.id, row.username)
      const token = this.generateToken(newUser)
      return { token, user: newUser }
    } else if (res.rowCount === 0) {
      throw new BusinessRuleEnforced(
        "Ce nom d'utilisateur n'est pas disponible."
      )
    } else {
      throw new Error()
    }
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
          } else {
            resolve(user)
          }
        }
      })
    })
  }

  async completeOnboarding (
    user: UserNotOnboarded,
    farmName: string
  ): Promise<{ token: string; user: User }> {
    const res = await this.pool.query({
      text: 'UPDATE users SET farmname=$2 WHERE username=$1;',
      values: [user.username, PsqlUtils.toDbStr(farmName)]
    })

    if (res.rowCount === 1) {
      const updatedUser = new User(user.id, user.username, farmName)
      await Database.createFarmDedicatedTables(this.pool, farmName)

      const token = this.generateToken(updatedUser)
      return { token, user: updatedUser }
    } else if (res.rowCount === 0) {
      throw new NotFound()
    } else {
      throw new Error()
    }
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

        if (authToken !== undefined) {
          return this.verifyToken(authToken)
            .then(user => callback(req, res, user))
            .catch(() => callback(req, res, undefined))
        } else {
          return res.redirect(401, '/api/login')
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
