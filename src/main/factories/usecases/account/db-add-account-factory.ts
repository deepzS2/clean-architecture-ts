import { DbAddAccount } from '@/data/usecases'
import { BcryptAdapter } from '@/infra/criptography'
import { AccountMongoRepository } from '@/infra/database/mongodb/account-mongo-repository'

export const makeDbAddAccount = (): DbAddAccount => {
  const hasher = new BcryptAdapter(12)
  const accountMongoRepository = new AccountMongoRepository()

  return new DbAddAccount(hasher, accountMongoRepository, accountMongoRepository)
}
