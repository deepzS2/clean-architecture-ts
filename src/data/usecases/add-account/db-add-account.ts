import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { Encrypter } from '../../protocols/encrypter'

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
