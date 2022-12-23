import { AuthenticationModel, AccountModel } from '@/domain/models'
import { AddAccount, AddAccountParams, Authentication, AuthenticationParams, LoadAccountByToken } from '@/domain/usecases'
import { faker } from '@faker-js/faker'

import { mockAccountModel } from '../../domain/mocks'

export class AddAccountSpy implements AddAccount {
  accountModel: AccountModel | null = mockAccountModel()
  addAccountParams: AddAccountParams

  async add (account: AddAccountParams): Promise<AccountModel | null> {
    this.addAccountParams = account

    return await Promise.resolve(this.accountModel)
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationModel: AuthenticationModel | null = {
    accessToken: faker.datatype.uuid(),
    name: faker.name.fullName()
  }

  authenticationParams: AuthenticationParams

  async auth (authenticationParams: AuthenticationParams): Promise<AuthenticationModel | null> {
    this.authenticationParams = authenticationParams
    return await Promise.resolve(this.authenticationModel)
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accountModel: AccountModel | null = mockAccountModel()
  accessToken: string
  role?: string

  async load (accessToken: string, role?: string): Promise<AccountModel | null> {
    this.accessToken = accessToken
    this.role = role

    return await Promise.resolve(this.accountModel)
  }
}
