import { it, describe, beforeEach, afterAll, beforeAll } from 'vitest'
import request from 'supertest'
import { MongoHelper } from '../../infra/database/mongodb/helpers/mongo-helper'
import { Express } from 'express'
import { setupApp } from '../config/app'

let app: Express

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__)
    app = await setupApp()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  it('Should return an account on success', async () => {
    await request(app).post('/api/signup').send({
      name: 'Alan',
      email: 'alanr.developer@hotmail.com',
      password: '123',
      passwordConfirmation: '123'
    }).expect(200)
  })
})
