import { AccountModel, AddAccount, AddAccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly _encrypter: Encrypter, private readonly _addAccountRepository: AddAccountRepository) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this._encrypter.encrypt(accountData.password)

    const account = await this._addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    })

    return account
  }
}
