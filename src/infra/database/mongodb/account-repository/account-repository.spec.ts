import { MongoHelper } from '../helpers/mongo-helper'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { AccountMongoRepository } from './account-repository'

const makeSut = (): AccountMongoRepository => new AccountMongoRepository()

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  it('Should return an account on success', async () => {
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
