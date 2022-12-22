import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'

import { Controller, HttpRequest, HttpResponse, Authentication, Validation } from './login-controller-protocols'

export class LoginController implements Controller {
  constructor (private readonly _authentication: Authentication, private readonly _validation: Validation) {

  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this._validation.validate(httpRequest.body)

      if (validationError) {
        return badRequest(validationError)
      }

      const { email, password } = httpRequest.body

      const authenticationModel = await this._authentication.auth({
        email,
        password
      })

      if (!authenticationModel) {
        return unauthorized()
      }

      return ok(authenticationModel)
    } catch (error) {
      return serverError(error)
    }
  }
}
