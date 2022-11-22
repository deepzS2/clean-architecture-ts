import { MongoHelper } from '../helpers/mongo-helper'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { AccountMongoRepository } from './account-mongo-repository'
import { Collection } from 'mongodb'

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

      const account = await sut.add({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account).toEqual(expect.objectContaining({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }))
    })
  })

  describe('Load by Email', () => {
    it('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()

      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
      const account = await sut.loadByEmail('any_email@mail.com')

      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account).toEqual(expect.objectContaining({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }))
    })

    it('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()

      const account = await sut.loadByEmail('any_email@mail.com')

      expect(account).toBeFalsy()
    })
  })

  describe('Update access token', () => {
    it('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const { insertedId } = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })

      let account = await accountCollection.findOne({ _id: insertedId })

      expect(account?.accessToken).toBeFalsy()

      await sut.updateAccessToken(insertedId.toString(), 'any_token')

      account = await accountCollection.findOne({ _id: insertedId })

      expect(account).toBeTruthy()
      expect(account?.accessToken).toBe('any_token')
    })
  })
})
