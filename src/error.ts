import { Response } from 'express'

class ApplicationError {
  constructor (readonly message: string = '') {}
}

export class ForbiddenException extends ApplicationError {}
export class WrongCredentialsException extends ApplicationError {}
export class UnknownUserException extends ApplicationError {}
export class IncompleteRequestException extends ApplicationError {}
export class BusinessRuleEnforced extends ApplicationError {
  constructor (message?: string) {
    super(message)
  }
}
export class NotFound extends ApplicationError {}

type ErrorKey = 'USER_NOT_ONBOARDED'

export class HttpError {
  constructor (
    public code: string | number,
    public description: string,
    readonly key?: ErrorKey
  ) {}
}

function toHttpMessage (error: Error): HttpError {
  return new HttpError(toHttpStatus(error), describe(error))
}

function toHttpStatus (error: Error): number {
  if (error instanceof ForbiddenException) {
    return 403
  } else if (
    error instanceof WrongCredentialsException ||
    error instanceof UnknownUserException
  ) {
    return 401
  } else if (
    error instanceof IncompleteRequestException ||
    error instanceof BusinessRuleEnforced
  ) {
    return 400
  } else if (error instanceof NotFound) {
    return 404
  } else {
    return 500
  }
}

function describe (error: Error) {
  if (error.message !== undefined && error.message !== '') {
    return error.message
  } else if (error instanceof ForbiddenException) {
    return 'Access forbidden, you may not have access rights'
  } else if (error instanceof WrongCredentialsException) {
    return "Votre nom d'utilisateur ou mot de passe est incorrect."
  } else if (error instanceof UnknownUserException) {
    return 'Utilisateur inconnu.'
  } else if (
    error instanceof IncompleteRequestException ||
    error instanceof BusinessRuleEnforced
  ) {
    return 'There is something wrong in the request. Very likely some wrong values, or business rules which are not respected.'
  } else if (error instanceof NotFound) {
    return 'The resource can not be found, it is very likely that it does not exist. Sorry.'
  } else {
    return 'Arf, we don\'t know what happened. We may have made a mistake while building the server. Sorry, please come back later.'
  }
}

export async function handleErrorsGlobally (
  f: () => Promise<void>,
  res: Response<any>
): Promise<void> {
  try {
    await f()
  } catch (error) {
    const status = toHttpStatus(error)
    res.status(status).json(toHttpMessage(error))

    if (status === 500) {
      console.error(error)
    }
  }
}
