import { AddAccountRepository, Hasher, CheckAccountByEmailRepository } from '@/data/protocols'
import { AddAccount } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor (private readonly _hasher: Hasher, private readonly _addAccountRepository: AddAccountRepository, private readonly _checkAccountByEmailRepository: CheckAccountByEmailRepository) {}

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    let hasCreatedAccount = false
    const accountExists = await this._checkAccountByEmailRepository.checkByEmail(accountData.email)

    if (accountExists) return hasCreatedAccount

    const hashedPassword = await this._hasher.hash(accountData.password)

    hasCreatedAccount = await this._addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    })

    return hasCreatedAccount
  }
}
