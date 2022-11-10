import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'

export class DbAuthentication implements Authentication {
  constructor (private readonly _loadAccountByEmailRepository: LoadAccountByEmailRepository, private readonly _hashComparer: HashComparer, private readonly _tokenGenerator: TokenGenerator, private readonly _updateAccessTokenRepository: UpdateAccessTokenRepository) {}

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this._loadAccountByEmailRepository.load(authentication.email)

    if (!account) return null

    const isPasswordCorrect = await this._hashComparer.compare(authentication.password, account.password)

    if (!isPasswordCorrect) return null

    const accessToken = await this._tokenGenerator.generate(account.id)

    await this._updateAccessTokenRepository.update(account.id, accessToken)

    return accessToken
  }
}
