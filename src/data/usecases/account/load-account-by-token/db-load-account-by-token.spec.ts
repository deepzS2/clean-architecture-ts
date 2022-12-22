import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DecrypterSpy, LoadAccountByTokenRepositorySpy } from '@/data/mocks'
import { faker } from '@faker-js/faker'

import { DbLoadAccountByToken } from './db-load-account-by-token'

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterSpy: DecrypterSpy
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy()
  const sut = new DbLoadAccountByToken(decrypterSpy, loadAccountByTokenRepositorySpy)

  return { sut, decrypterSpy, loadAccountByTokenRepositorySpy }
}

let token: string
let role: string

describe('DbLoadAccountByToken Usecase', () => {
  beforeEach(() => {
    token = faker.datatype.uuid()
    role = faker.random.word()
  })

  it('Should call Decrypter with correct value', async () => {
    const { sut, decrypterSpy } = makeSut()
    await sut.load(token, role)

    expect(decrypterSpy.ciphertext).toBe(token)
  })

  it('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut()
    decrypterSpy.plaintext = null

    const account = await sut.load(token, role)
    expect(account).toBeNull()
  })

  it('Should throw if Decrypter throws', async () => {
    const { sut, decrypterSpy } = makeSut()
    vi.spyOn(decrypterSpy, 'decrypt').mockRejectedValueOnce(new Error())

    const account = await sut.load(token, role)
    await expect(account).toBeNull()
  })

  it('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    await sut.load(token, role)

    expect(loadAccountByTokenRepositorySpy.token).toBe(token)
    expect(loadAccountByTokenRepositorySpy.role).toBe(role)
  })

  it('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    loadAccountByTokenRepositorySpy.accountModel = null

    const account = await sut.load(token, role)
    expect(account).toBeNull()
  })

  it('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    vi.spyOn(loadAccountByTokenRepositorySpy, 'loadByToken').mockRejectedValueOnce(new Error())

    const promise = sut.load(token, role)

    await expect(promise).rejects.toThrow()
  })

  it('Should return an account on success', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut()
    const account = await sut.load(token, role)

    expect(account).toEqual(loadAccountByTokenRepositorySpy.accountModel)
  })
})
