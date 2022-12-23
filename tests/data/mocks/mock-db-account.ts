import { LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository, AddAccountRepository } from '@/data/protocols'
import { AccountModel } from '@/domain/models/account'

import { mockAccountModel } from '../../domain/mocks'

export class AddAccountRepositorySpy implements AddAccountRepository {
  accountModel = mockAccountModel()
  addAccountParams: AddAccountRepository.Params

  async add (data: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    this.addAccountParams = data

    return await Promise.resolve(this.accountModel)
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  accountModel: AccountModel | null = mockAccountModel()
  email: string

  async loadByEmail (email: string): Promise<AccountModel | null> {
    this.email = email

    return await Promise.resolve(this.accountModel)
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  accountModel: LoadAccountByTokenRepository.Result = mockAccountModel()
  token: string
  role?: string

  async loadByToken (token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
    this.token = token
    this.role = role

    return await Promise.resolve(this.accountModel)
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id: string
  token: string

  async updateAccessToken (id: string, token: string): Promise<void> {
    this.id = id
    this.token = token

    return await Promise.resolve()
  }
}
