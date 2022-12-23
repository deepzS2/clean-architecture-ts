import bcrypt from 'bcrypt'
import { Express } from 'express'
import { Collection } from 'mongodb'
import request from 'supertest'
import { it, describe, beforeEach, afterAll, beforeAll } from 'vitest'

import { MongoHelper } from '@/infra/database'
import { setupApp } from '@/main/config/app'

let app: Express
let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__)
    app = await setupApp()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    it('Should return 200 on signup', async () => {
      await request(app).post('/api/signup').send({
        name: 'Alan',
        email: 'alanr.developer@hotmail.com',
        password: '123',
        passwordConfirmation: '123'
      }).expect(200)
    })
  })

  describe('POST /login', () => {
    it('Should return 200 on login', async () => {
      const password = bcrypt.hashSync('123', 12)

      await accountCollection.insertOne({
        name: 'Alan',
        email: 'alanr.developer@hotmail.com',
        password
      })

      await request(app).post('/api/login').send({
        email: 'alanr.developer@hotmail.com',
        password: '123'
      }).expect(200)
    })

    it('Should return 401 on login', async () => {
      await request(app).post('/api/login').send({
        email: 'alanr.developer@hotmail.com',
        password: '123'
      }).expect(401)
    })
  })
})
