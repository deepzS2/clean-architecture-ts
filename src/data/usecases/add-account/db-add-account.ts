import { AccountModel, AddAccount, AddAccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly _hasher: Hasher, private readonly _addAccountRepository: AddAccountRepository) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this._hasher.hash(accountData.password)

    const account = await this._addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    })

    return account
  }
}
