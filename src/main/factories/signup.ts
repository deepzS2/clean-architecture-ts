import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/database/mongodb/account-repository/account-repository'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export const makeSignUpController = (): SignUpController => {
  const encrypter = new BcryptAdapter(10)
  const accountMongoRepository = new AccountMongoRepository()

  const emailValidator = new EmailValidatorAdapter()
  const addAccount = new DbAddAccount(encrypter, accountMongoRepository)

  return new SignUpController(emailValidator, addAccount)
}
