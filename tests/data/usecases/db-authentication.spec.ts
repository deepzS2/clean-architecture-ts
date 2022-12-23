import { describe, expect, it, vi } from 'vitest'

import { DbAuthentication } from '@/data/usecases'

import { mockAuthenticationParams } from '../../domain/mocks'
import { EncrypterSpy, HashComparerSpy, LoadAccountByEmailRepositorySpy, UpdateAccessTokenRepositorySpy } from '../mocks'

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
  hashComparerSpy: HashComparerSpy
  encrypterSpy: EncrypterSpy
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  const hashComparerSpy = new HashComparerSpy()
  const encrypterSpy = new EncrypterSpy()
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()
  const sut = new DbAuthentication(loadAccountByEmailRepositorySpy, hashComparerSpy, encrypterSpy, updateAccessTokenRepositorySpy)

  return {
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy,
    sut
  }
}

describe('DbAuthentication UseCase', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const authenticationParams = mockAuthenticationParams()

    await sut.auth(authenticationParams)
    expect(loadAccountByEmailRepositorySpy.email).toBe(authenticationParams.email)
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    vi.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockRejectedValueOnce(new Error())

    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.accountModel = null

    const model = await sut.auth(mockAuthenticationParams())
    expect(model).toBeNull()
  })

  it('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerSpy, loadAccountByEmailRepositorySpy } = makeSut()
    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)

    expect(hashComparerSpy.plaintext).toBe(authenticationParams.password)
    expect(hashComparerSpy.digest).toBe(loadAccountByEmailRepositorySpy.accountModel?.password)
  })

  it('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerSpy } = makeSut()
    vi.spyOn(hashComparerSpy, 'compare').mockRejectedValueOnce(new Error())

    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerSpy } = makeSut()
    hashComparerSpy.isValid = false

    const model = await sut.auth(mockAuthenticationParams())
    expect(model).toBeNull()
  })

  it('Should call Encrypter with correct id', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut()
    await sut.auth(mockAuthenticationParams())

    expect(encrypterSpy.plaintext).toBe(loadAccountByEmailRepositorySpy.accountModel?.id)
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    vi.spyOn(encrypterSpy, 'encrypt').mockRejectedValueOnce(new Error())

    const promise = sut.auth(mockAuthenticationParams())

    await expect(promise).rejects.toThrow()
  })

  it('Should return an AuthenticationModel on success', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut()
    const model = await sut.auth(mockAuthenticationParams())

    expect(model?.accessToken).toBe(encrypterSpy.ciphertext)
    expect(model?.name).toBe(loadAccountByEmailRepositorySpy.accountModel?.name)
  })

  it('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositorySpy, loadAccountByEmailRepositorySpy, encrypterSpy } = makeSut()
    await sut.auth(mockAuthenticationParams())

    expect(updateAccessTokenRepositorySpy.id).toBe(loadAccountByEmailRepositorySpy.accountModel?.id)
    expect(updateAccessTokenRepositorySpy.token).toBe(encrypterSpy.ciphertext)
  })

  it('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut()
    vi.spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken').mockRejectedValueOnce(new Error())

    const promise = sut.auth(mockAuthenticationParams())

    await expect(promise).rejects.toThrow()
  })
})
