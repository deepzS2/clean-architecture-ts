import { Authentication } from '@/domain/usecases'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class LoginController implements Controller {
  constructor (private readonly _authentication: Authentication, private readonly _validation: Validation) {

  }

  async handle (request: LoginController.Request): Promise<HttpResponse> {
    try {
      const validationError = this._validation.validate(request)

      if (validationError) {
        return badRequest(validationError)
      }

      const { email, password } = request

      const data = await this._authentication.auth({
        email,
        password
      })

      if (!data) {
        return unauthorized()
      }

      return ok(data)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoginController {
  export interface Request {
    email: string
    password: string
  }
}
