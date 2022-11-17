import { EmailInUseError } from '../../errors'
import { badRequest, forbidden, ok, serverError } from '../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, AddAccount, Validation, Authentication } from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor (private readonly _addAccount: AddAccount, private readonly _validation: Validation, private readonly authentication: Authentication) {

  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this._validation.validate(httpRequest.body)

      if (validationError) {
        return badRequest(validationError)
      }

      const { email, name, password } = httpRequest.body

      const account = await this._addAccount.add({
        email,
        name,
        password
      })

      if (!account) {
        return forbidden(new EmailInUseError())
      }

      const accessToken = await this.authentication.auth({
        email,
        password
      })

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
