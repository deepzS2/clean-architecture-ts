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
    const loginQuery = (email: string, password: string): string => `
      query {
        login(email: "${email}", password: "${password}") {
          accessToken
          name
        }
      }
    `

    it('Should return an account on valid credentials', async () => {
      const passwordHashed = bcrypt.hashSync('123456', 12)

      await accountCollection.insertOne({
        name: 'Alan',
        email: 'alanr.developer@hotmail.com',
        password: passwordHashed
      })

      const result = await request(app).post('/graphql').send({ query: loginQuery('alanr.developer@hotmail.com', '123456') })

      expect(result.status).toBe(200)
      expect(result.body.data.login.accessToken).toBeTruthy()
      expect(result.body.data.login.name).toBe('Alan')
    })

    it('Should return UnauthorizedError on invalid credentials', async () => {
      const result = await request(app).post('/graphql').send({ query: loginQuery('alanr.developer@hotmail.com', '123456') })

      expect(result.status).toBe(401)
      expect(result.body.data).toBeFalsy()
      expect(result.body.errors[0].message).toBe('Unauthorized')
    })
  })

  describe('SignUp Mutation', () => {
    const signUpMutation = (name: string, email: string, password: string, passwordConfirmation: string): string => `
      mutation {
        signUp(name: "${name}", email: "${email}", password: "${password}", passwordConfirmation: "${passwordConfirmation}") {
          accessToken
          name
        }
      }
    `

    it('Should return an account on valid data', async () => {
      const query = signUpMutation('Alan', 'alanr.developer@hotmail.com', '123456', '123456')

      const result = await request(app).post('/graphql').send({ query })

      expect(result.status).toBe(200)
      expect(result.body.data.signUp.accessToken).toBeTruthy()
      expect(result.body.data.signUp.name).toBe('Alan')
    })

    it('Should return EmailInUseError on invalid data', async () => {
      const passwordHashed = bcrypt.hashSync('123456', 12)

      await accountCollection.insertOne({
        name: 'Alan',
        email: 'alanr.developer@hotmail.com',
        password: passwordHashed
      })

      const query = signUpMutation('Alan', 'alanr.developer@hotmail.com', '123456', '123456')

      const result = await request(app).post('/graphql').send({ query })

      expect(result.status).toBe(403)
      expect(result.body.data).toBeFalsy()
      expect(result.body.errors[0].message).toBe('The received email is already in use')
    })
  })
})
