import { AddAccount, Authentication } from '@/domain/usecases'
import { EmailInUseError } from '@/presentation/errors'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class SignUpController implements Controller {
  constructor (private readonly _addAccount: AddAccount, private readonly _validation: Validation, private readonly authentication: Authentication) {

  }

  async handle (request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const validationError = this._validation.validate(request)

      if (validationError) {
        return badRequest(validationError)
      }

      const { email, name, password } = request

      const account = await this._addAccount.add({
        email,
        name,
        password
      })

      if (!account) {
        return forbidden(new EmailInUseError())
      }

      const authenticationModel = await this.authentication.auth({
        email,
        password
      })

      return ok(authenticationModel)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SignUpController {
  export interface Request {
    email: string
    name: string
    password: string
    passwordConfirmation: string
  }
}
