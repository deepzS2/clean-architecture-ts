import { Decrypter, LoadAccountByTokenRepository } from '@/data/protocols'
import { AccountModel } from '@/domain/models'
import { LoadAccountByToken } from '@/domain/usecases'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly _decrypter: Decrypter, private readonly _loadAccountByTokenRepository: LoadAccountByTokenRepository) {}

  async load (accessToken: string, role?: string | undefined): Promise<AccountModel | null> {
    let token: string | null

    try {
      token = await this._decrypter.decrypt(accessToken)
    } catch (error) {
      return null
    }

    if (!token) return null

    const account = await this._loadAccountByTokenRepository.loadByToken(accessToken, role)

    if (!account) return null

    return account
  }
}
