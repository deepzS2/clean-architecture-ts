import { describe, expect, it, vi } from 'vitest'

import { DbAddAccount } from '@/data/usecases'

import { mockAccountModel, mockAddAccountParams } from '../../domain/mocks'
import { HasherSpy, AddAccountRepositorySpy, LoadAccountByEmailRepositorySpy } from '../mocks'

interface SutTypes {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  const hasherSpy = new HasherSpy()
  const addAccountRepositorySpy = new AddAccountRepositorySpy()

  loadAccountByEmailRepositorySpy.accountModel = null

  const sut = new DbAddAccount(hasherSpy, addAccountRepositorySpy, loadAccountByEmailRepositorySpy)

  return { sut, hasherSpy, addAccountRepositorySpy, loadAccountByEmailRepositorySpy }
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

  it('Should throws if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut()
    vi.spyOn(addAccountRepositorySpy, 'add').mockRejectedValueOnce(new Error())

    const promise = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    const addAccountParams = mockAddAccountParams()

    await sut.add(addAccountParams)

    expect(loadAccountByEmailRepositorySpy.email).toBe(addAccountParams.email)
  })

  it('Should return false if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()
    loadAccountByEmailRepositorySpy.accountModel = mockAccountModel()

    const hasCreatedAccount = await sut.add(mockAddAccountParams())
    expect(hasCreatedAccount).toBeFalsy()
  })

  it('Should return true if LoadAccountByEmailRepository returns null', async () => {
    const { sut } = makeSut()

    const hasCreatedAccount = await sut.add(mockAddAccountParams())
    expect(hasCreatedAccount).toBeTruthy()
  })
})
