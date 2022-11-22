import { AccountModel, Decrypter, LoadAccountByToken } from './db-load-acccount-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly _decrypter: Decrypter) {}

  async load (accessToken: string, role?: string | undefined): Promise<AccountModel | null> {
    await this._decrypter.decrypt(accessToken)

    return await Promise.resolve(null)
  }
}
