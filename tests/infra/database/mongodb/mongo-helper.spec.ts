import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { MongoHelper as sut } from '@/infra/database'

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
