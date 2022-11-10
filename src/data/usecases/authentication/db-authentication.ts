import { Authentication, AuthenticationModel, HashComparer, LoadAccountByEmailRepository, Encrypter, UpdateAccessTokenRepository } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (private readonly _loadAccountByEmailRepository: LoadAccountByEmailRepository, private readonly _hashComparer: HashComparer, private readonly _tokenGenerator: Encrypter, private readonly _updateAccessTokenRepository: UpdateAccessTokenRepository) {}

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this._loadAccountByEmailRepository.load(authentication.email)

    if (!account) return null

    const isPasswordCorrect = await this._hashComparer.compare(authentication.password, account.password)

    if (!isPasswordCorrect) return null

    const accessToken = await this._tokenGenerator.encrypt(account.id)

    await this._updateAccessTokenRepository.updateAccessToken(account.id, accessToken)

    return accessToken
  }
}
