import { Collection } from 'mongodb'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { mockAddAccountParams } from '@/domain/mocks'

import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection
const makeSut = (): AccountMongoRepository => new AccountMongoRepository()

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Add', () => {
    it('Should return an account on add success', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()

      const account = await sut.add(addAccountParams)

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account).toEqual(expect.objectContaining(addAccountParams))
    })
  })

  describe('Load by Email', () => {
    it('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()

      await accountCollection.insertOne(addAccountParams)
      const account = await sut.loadByEmail(addAccountParams.email)

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account).toEqual(expect.objectContaining(addAccountParams))
    })

    it('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByEmail('any_email@mail.com')

      expect(account).toBeFalsy()
    })
  })

  describe('Load by Token', () => {
    it('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()

      await accountCollection.insertOne({
        ...addAccountParams,
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token')

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account).toEqual(expect.objectContaining(addAccountParams))
    })

    it('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()

      await accountCollection.insertOne({
        ...addAccountParams,
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any_token', 'admin')

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account).toEqual(expect.objectContaining(addAccountParams))
    })

    it('Should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()

      await accountCollection.insertOne({
        ...addAccountParams,
        accessToken: 'any_token',
        role: 'admin'
      })
      const account = await sut.loadByToken('any_token')

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account).toEqual(expect.objectContaining(addAccountParams))
    })

    it('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()

      await accountCollection.insertOne({
        ...addAccountParams,
        accessToken: 'any_token'
      })
      const account = await sut.loadByToken('any_token', 'admin')

      expect(account).toBeFalsy()
    })

    it('Should return null if loadByToken fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByToken('any_token')

      expect(account).toBeFalsy()
    })
  })

  describe('Update access token', () => {
    it('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const addAccountParams = mockAddAccountParams()

      const { insertedId } = await accountCollection.insertOne(addAccountParams)

      let account = await accountCollection.findOne({ _id: insertedId })

      expect(account?.accessToken).toBeFalsy()

      await sut.updateAccessToken(insertedId.toString(), 'any_token')

      account = await accountCollection.findOne({ _id: insertedId })

      expect(account).toBeTruthy()
      expect(account?.accessToken).toBe('any_token')
    })
  })
})
