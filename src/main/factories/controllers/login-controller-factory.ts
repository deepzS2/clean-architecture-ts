
import { makeLogControllerDecorator, makeDbAuthentication, makeLoginValidation } from '@/main/factories'
import { LoginController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeLoginController = (): Controller => {
  return makeLogControllerDecorator(new LoginController(makeDbAuthentication(), makeLoginValidation()))
}
