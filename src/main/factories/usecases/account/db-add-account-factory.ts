import { DbAddAccount } from '../../../../data/usecases/add-account/db-add-account'
import { AddAccount } from '../../../../domain/usecases/add-account'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../infra/database/mongodb/account/account-mongo-repository'

export const makeDbAddAccount = (): AddAccount => {
  const hasher = new BcryptAdapter(12)
  const accountMongoRepository = new AccountMongoRepository()

  return new DbAddAccount(hasher, accountMongoRepository, accountMongoRepository)
}
