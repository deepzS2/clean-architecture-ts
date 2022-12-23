import { AddAccount, Authentication, LoadAccountByToken } from '@/domain/usecases'
import { faker } from '@faker-js/faker'

export class AddAccountSpy implements AddAccount {
  hasCreatedAccount = true
  addAccountParams: AddAccount.Params

  async add (account: AddAccount.Params): Promise<AddAccount.Result> {
    this.addAccountParams = account

    return await Promise.resolve(this.hasCreatedAccount)
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationModel: Authentication.Result = {
    accessToken: faker.datatype.uuid(),
    name: faker.name.fullName()
  }

  authenticationParams: Authentication.Params

  async auth (authenticationParams: Authentication.Params): Promise<Authentication.Result> {
    this.authenticationParams = authenticationParams
    return await Promise.resolve(this.authenticationModel)
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accountModel: LoadAccountByToken.Result = { id: faker.datatype.uuid() }
  accessToken: string
  role?: string

  async load (accessToken: string, role?: string): Promise<LoadAccountByToken.Result> {
    this.accessToken = accessToken
    this.role = role

    return await Promise.resolve(this.accountModel)
  }
}
