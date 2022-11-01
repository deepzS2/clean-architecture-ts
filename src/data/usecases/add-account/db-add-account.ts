import { AccountModel, AddAccount, AddAccountModel, Encrypter } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly _encrypter: Encrypter) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    const passwordEncrypted = await this._encrypter.encrypt(account.password)

    return await new Promise(resolve => resolve({
      id: 'valid_id',
      ...account,
      password: passwordEncrypted
    }))
  }
}
