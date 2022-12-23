import { Encrypter, HashComparer, LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '@/data/protocols'
import { Authentication } from '@/domain/usecases'

export class DbAuthentication implements Authentication {
  constructor (private readonly _loadAccountByEmailRepository: LoadAccountByEmailRepository, private readonly _hashComparer: HashComparer, private readonly _tokenGenerator: Encrypter, private readonly _updateAccessTokenRepository: UpdateAccessTokenRepository) {}

  async auth (authenticationParams: Authentication.Params): Promise<Authentication.Result> {
    const account = await this._loadAccountByEmailRepository.loadByEmail(authenticationParams.email)

    if (!account) return null

    const isPasswordCorrect = await this._hashComparer.compare(authenticationParams.password, account.password)

    if (!isPasswordCorrect) return null

    const accessToken = await this._tokenGenerator.encrypt(account.id)

    await this._updateAccessTokenRepository.updateAccessToken(account.id, accessToken)

    return { accessToken, name: account.name }
  }
}
