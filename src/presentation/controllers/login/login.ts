import { MissingParamError } from '../../errors'
import { badRequest, ok } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest

    if (!body.email) {
      return await Promise.resolve(badRequest(new MissingParamError('email')))
    }

    if (!body.password) {
      return await Promise.resolve(badRequest(new MissingParamError('password')))
    }

    return ok(body)
  }
}
