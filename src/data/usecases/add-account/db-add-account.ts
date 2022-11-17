import { AccountModel, AddAccount, AddAccountModel, Hasher, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly _hasher: Hasher, private readonly _addAccountRepository: AddAccountRepository, private readonly _loadAccountByEmailRepository: LoadAccountByEmailRepository) {}

  async add (accountData: AddAccountModel): Promise<AccountModel | null> {
    const accountExists = await this._loadAccountByEmailRepository.loadByEmail(accountData.email)

    if (accountExists) return null

    const hashedPassword = await this._hasher.hash(accountData.password)

    const account = await this._addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    })

    return account
  }
}
