import { describe, expect, it, vi } from 'vitest'

import { DbAddAccount } from '@/data/usecases'

import { mockAddAccountParams } from '../../domain/mocks'
import { HasherSpy, AddAccountRepositorySpy, CheckAccountByEmailRepositorySpy } from '../mocks'

interface SutTypes {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkAccountByEmailRepositorySpy = new CheckAccountByEmailRepositorySpy()
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()

  const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, checkAccountByEmailRepositorySpy)

  return { sut, hasherSpy, addAccountRepositorySpy, checkAccountByEmailRepositorySpy }
}

describe('DbAddAccount Usecase', () => {
  it('Should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut()
    const addAccountParams = mockAddAccountParams()

    await sut.add(addAccountParams)
    expect(hasherSpy.plaintext).toBe(addAccountParams.password)
  })

  it('Should throws if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    vi.spyOn(hasherSpy, 'hash').mockRejectedValueOnce(new Error())

    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositorySpy, hasherSpy } = makeSut()
    const addAccountParams = mockAddAccountParams()

    await sut.add(addAccountParams)

    expect(addAccountRepositorySpy.addAccountParams).toEqual({
      name: addAccountParams.name,
      email: addAccountParams.email,
      password: hasherSpy.digest
    })
  })

  it('Should return false if AddAccountRepository returns false', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    addAccountRepositorySpy.hasCreatedAccount = false

    const hasCreatedAccount = await sut.add(mockAddAccountParams())
    expect(hasCreatedAccount).toBeFalsy()
  })

  it('Should throws if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    vi.spyOn(addAccountRepositorySpy, 'add').mockRejectedValueOnce(new Error())

    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('Should call CheckAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    const addAccountParams = mockAddAccountParams()

    await sut.add(addAccountParams)

    expect(checkAccountByEmailRepositorySpy.email).toBe(addAccountParams.email)
  })

  it('Should return false if CheckAccountByEmailRepository returns an account', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    checkAccountByEmailRepositorySpy.result = true

    const hasCreatedAccount = await sut.add(mockAddAccountParams())
    expect(hasCreatedAccount).toBeFalsy()
  })

  it('Should return true if CheckAccountByEmailRepository returns null', async () => {
    const { sut } = makeSut()

    const hasCreatedAccount = await sut.add(mockAddAccountParams())
    expect(hasCreatedAccount).toBeTruthy()
  })
})
