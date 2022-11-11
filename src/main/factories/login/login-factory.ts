import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/database/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/database/mongodb/log/log-mongo-repository'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import env from '../../config/env'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): LogControllerDecorator => {
  const hashComparer = new BcryptAdapter(12)
  const tokenGenerator = new JwtAdapter(env.jwtSecret)
  const accountRepository = new AccountMongoRepository()
  const logMongoRepository = new LogMongoRepository()

  const authentication = new DbAuthentication(accountRepository, hashComparer, tokenGenerator, accountRepository)
  const signUpController = new LoginController(authentication, makeLoginValidation())

  return new LogControllerDecorator(signUpController, logMongoRepository)
}
