import { DbAuthentication } from '@/data/usecases'
import { BcryptAdapter, JwtAdapter } from '@/infra/criptography'
import { AccountMongoRepository } from '@/infra/database'
import env from '@/main/config/env'

export const makeDbAuthentication = (): DbAuthentication => {
  const hashComparer = new BcryptAdapter(12)
  const tokenGenerator = new JwtAdapter(env.jwtSecret)
  const accountRepository = new AccountMongoRepository()

  return new DbAuthentication(accountRepository, hashComparer, tokenGenerator, accountRepository)
}
