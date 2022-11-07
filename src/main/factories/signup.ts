import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/database/mongodb/account-repository/account-repository'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignUpController = (): LogControllerDecorator => {
  const encrypter = new BcryptAdapter(10)
  const accountMongoRepository = new AccountMongoRepository()

  const emailValidator = new EmailValidatorAdapter()
  const addAccount = new DbAddAccount(encrypter, accountMongoRepository)
  const signUpController = new SignUpController(emailValidator, addAccount)

  return new LogControllerDecorator(signUpController)
}
