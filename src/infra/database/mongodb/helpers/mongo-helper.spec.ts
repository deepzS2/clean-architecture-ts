import { MongoHelper as sut } from './mongo-helper'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(globalThis.__MONGO_URI__)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  it('Should connect if MongoDB is down', async () => {
    let accountsCollection = await sut.getCollection('accounts')
    expect(accountsCollection).toBeTruthy()

    await sut.disconnect()

    accountsCollection = await sut.getCollection('accounts')
    expect(accountsCollection).toBeTruthy()
  })
})
