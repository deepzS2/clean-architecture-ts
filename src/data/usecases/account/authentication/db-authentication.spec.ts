import { describe, expect, it, vi } from 'vitest'

import { mockEncrypter, mockHashComparer, mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '@/data/mocks'
import { mockAuthenticationParams } from '@/domain/mocks'

import { DbAuthentication } from './db-authentication'
import { HashComparer, LoadAccountByEmailRepository, Encrypter, UpdateAccessTokenRepository } from './db-authentication-protocols'

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const hashComparerStub = mockHashComparer()
  const encrypterStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub)

  return {
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
    sut
  }
}

describe('DbAuthentication UseCase', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.auth(mockAuthenticationParams())

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())

    const promise = sut.auth(mockAuthenticationParams())

    await expect(promise).rejects.toThrow()
  })

  it('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(null))

    const accessToken = await sut.auth(mockAuthenticationParams())

    expect(accessToken).toBeNull()
  })

  it('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = vi.spyOn(hashComparerStub, 'compare')

    await sut.auth(mockAuthenticationParams())

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  it('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    vi.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error())

    const promise = sut.auth(mockAuthenticationParams())

    await expect(promise).rejects.toThrow()
  })

  it('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    vi.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))

    const accessToken = await sut.auth(mockAuthenticationParams())

    expect(accessToken).toBeNull()
  })

  it('Should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const generateSpy = vi.spyOn(encrypterStub, 'encrypt')

    await sut.auth(mockAuthenticationParams())

    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    vi.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())

    const promise = sut.auth(mockAuthenticationParams())

    await expect(promise).rejects.toThrow()
  })

  it('Should return a token on success', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth(mockAuthenticationParams())

    expect(accessToken).toBe('any_token')
  })

  it('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = vi.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')

    await sut.auth(mockAuthenticationParams())

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  it('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    vi.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockRejectedValueOnce(new Error())

    const promise = sut.auth(mockAuthenticationParams())

    await expect(promise).rejects.toThrow()
  })
})
