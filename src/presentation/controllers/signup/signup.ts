import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAccount } from './signup-protocols'

export class SignUpController implements Controller {
  constructor (private readonly _emailValidator: EmailValidator, private readonly _addAccount: AddAccount) {

  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, name, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValidEmail = this._emailValidator.isValid(email)

      if (!isValidEmail) return badRequest(new InvalidParamError('email'))

      const account = await this._addAccount.add({
        email,
        name,
        password
      })

      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
