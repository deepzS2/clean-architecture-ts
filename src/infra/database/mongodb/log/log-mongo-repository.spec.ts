import { Collection } from 'mongodb'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { faker } from '@faker-js/faker'

import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log-mongo-repository'

const makeSut = (): LogErrorRepository => {
  const sut = new LogMongoRepository()

  return sut
}

describe('LogMongoRepository', () => {
  let errorsCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorsCollection = await MongoHelper.getCollection('errors')
    await errorsCollection.deleteMany({})
  })

  it('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError(faker.random.words())

    const count = await errorsCollection.countDocuments()

    expect(count).toBe(1)
  })
})
