import { AxiosError } from 'axios'

export class AuthenticationRequiredException extends Error {}

export type ApiError = Error & {
  key?: ErrorKey
  code: string | number
  description: string
}

type ErrorKey = 'USER_NOT_ONBOARDED'

const USER_NOT_ONBOARDED = 'USER_NOT_ONBOARDED'
export const ERROR_KEYS = { USER_NOT_ONBOARDED }

type AnyObject = { [key: string]: any }

export function isApiError (error: AnyObject): error is ApiError {
  const code = error.code
  const description = error.description
  const key = error.code

  return (
    code !== undefined &&
    ['string', 'number'].includes(typeof code) &&
    description !== undefined &&
    typeof description === 'string' &&
    (key === undefined ||
      (key !== undefined &&
        typeof key === 'string' &&
        Object.keys(ERROR_KEYS).includes(key)))
  )
}

export function isAxiosError (error: AnyObject): error is AxiosError {
  return error.isAxiosError
}
