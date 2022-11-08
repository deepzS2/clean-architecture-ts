import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../../protocols/email-validator'

export class LoginController implements Controller {
  constructor (private readonly _emailValidator: EmailValidator) {

  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body

    if (!email) {
      return await Promise.resolve(badRequest(new MissingParamError('email')))
    }

    if (!password) {
      return await Promise.resolve(badRequest(new MissingParamError('password')))
    }

    const isValidEmail = this._emailValidator.isValid(email)

    if (!isValidEmail) {
      return await Promise.resolve(badRequest(new InvalidParamError('email')))
    }

    return ok({ email, password })
  }
}
