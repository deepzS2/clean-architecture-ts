import { AccountModel, AddAccount, AddAccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly _encrypter: Encrypter, private readonly _addAccountRepository: AddAccountRepository) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this._encrypter.encrypt(accountData.password)

    await this._addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    })

    return await new Promise(resolve => resolve({
      id: 'valid_id',
      ...accountData,
      password: hashedPassword
    }))
  }
}
