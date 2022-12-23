import bcrypt from 'bcrypt'
import { Express } from 'express'
import { Collection } from 'mongodb'
import request from 'supertest'
import { it, describe, beforeEach, afterAll, beforeAll, expect } from 'vitest'

import { MongoHelper } from '@/infra/database'
import { setupApp } from '@/main/config/app'

let app: Express
let accountCollection: Collection

describe('Login GraphQL', () => {
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

  describe('Login Query', () => {
    const email = 'alanr.developer@hotmail.com'
    const password = '123456'

    const loginQuery = `
      query {
        login(email: "${email}", password: "${password}") {
          accessToken
          name
        }
      }
    `

    it('Should return an account on valid credentials', async () => {
      const passwordHashed = bcrypt.hashSync(password, 12)

      await accountCollection.insertOne({
        name: 'Alan',
        email,
        password: passwordHashed
      })

      const result = await request(app).post('/graphql').send({ query: loginQuery })

      expect(result.status).toBe(200)
      expect(result.body.data.login.accessToken).toBeTruthy()
      expect(result.body.data.login.name).toBe('Alan')
    })
  })
})
