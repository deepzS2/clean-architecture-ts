import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (private readonly _loadAccountByEmailRepository: LoadAccountByEmailRepository, private readonly _hashComparer: HashComparer) {}

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this._loadAccountByEmailRepository.load(authentication.email)

    if (!account) return null

    await this._hashComparer.compare(authentication.password, account.password)

    return null
  }
}
