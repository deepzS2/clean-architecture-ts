import { AccessDeniedError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse, LoadAccountByToken, Middleware } from './auth-middleware-protocols'

export class AuthMiddleware implements Middleware {
  constructor (private readonly _loadAccountByToken: LoadAccountByToken) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']

      if (!accessToken) return forbidden(new AccessDeniedError())

      const account = await this._loadAccountByToken.load(accessToken)

      if (!account) return forbidden(new AccessDeniedError())

      return ok({ accountId: account.id })
    } catch (error) {
      return serverError(error)
    }
  }
}
