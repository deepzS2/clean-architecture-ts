import { DbLoadAccountByToken } from '@/data/usecases'
import { JwtAdapter } from '@/infra/criptography'
import { AccountMongoRepository } from '@/infra/database'
import env from '@/main/config/env'

export const makeLoadAccountByToken = (): DbLoadAccountByToken => {
  const decrypter = new JwtAdapter(env.jwtSecret)
  const accountRepository = new AccountMongoRepository()

  return new DbLoadAccountByToken(decrypter, accountRepository)
}
