import { DbLoadAccountByToken } from '@/data/usecases/account/load-account-by-token/db-load-account-by-token'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@/infra/database/mongodb/account/account-mongo-repository'
import env from '@/main/config/env'

export const makeLoadAccountByToken = (): LoadAccountByToken => {
  const decrypter = new JwtAdapter(env.jwtSecret)
  const accountRepository = new AccountMongoRepository()

  return new DbLoadAccountByToken(decrypter, accountRepository)
}
