import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogErrorRepository } from '../../../../data/protocols/log-error-repository'
import { Collection } from 'mongodb'
import { LogMongoRepository } from './log'

const makeSut = (): LogErrorRepository => {
  const sut = new LogMongoRepository()

  return sut
}

describe('Log Mongo Repository', () => {
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
    await sut.logError('any_error')

    const count = await errorsCollection.countDocuments()

    expect(count).toBe(1)
  })
})
