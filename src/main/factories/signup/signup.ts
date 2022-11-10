import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/database/mongodb/account-repository/account-repository'
import { LogMongoRepository } from '../../../infra/database/mongodb/log-repository/log'
import { SignUpController } from '../../../presentation/controllers/signup/signup'
import { LogControllerDecorator } from '../../decorators/log'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): LogControllerDecorator => {
  const hasher = new BcryptAdapter(10)
  const accountMongoRepository = new AccountMongoRepository()
  const logMongoRepository = new LogMongoRepository()

  const addAccount = new DbAddAccount(hasher, accountMongoRepository)
  const signUpController = new SignUpController(addAccount, makeSignUpValidation())

  return new LogControllerDecorator(signUpController, logMongoRepository)
}
