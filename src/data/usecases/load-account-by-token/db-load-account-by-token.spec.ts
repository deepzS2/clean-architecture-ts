import { describe, expect, it, vi } from 'vitest'
import { AccountModel, Decrypter, LoadAccountByTokenRepository } from './db-load-acccount-by-token-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel | null> {
      return await Promise.resolve(makeFakeAccount())
    }
  }

  return new LoadAccountByTokenRepositoryStub()
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await Promise.resolve('any_value')
    }
  }

  return new DecrypterStub()
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)

  return { sut, decrypterStub, loadAccountByTokenRepositoryStub }
}

describe('DbLoadAccountByToken Usecase', () => {
  it('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = vi.spyOn(decrypterStub, 'decrypt')

    await sut.load('any_token', 'any_role')

    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  it('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    vi.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null))

    const account = await sut.load('any_token', 'any_role')

    expect(account).toBeFalsy()
  })

  it('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = vi.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')

    await sut.load('any_token', 'any_role')

    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  it('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    vi.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(Promise.resolve(null))

    const account = await sut.load('any_token', 'any_role')

    expect(account).toBeFalsy()
  })

  it('Should return an account on success', async () => {
    const { sut } = makeSut()

    const account = await sut.load('any_token', 'any_role')

    expect(account).toEqual(makeFakeAccount())
  })
})
