import { Express } from 'express'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import { it, describe, beforeEach, afterAll, beforeAll } from 'vitest'

import { MongoHelper } from '@/infra/database'
import { setupApp } from '@/main/config/app'
import env from '@/main/config/env'

let app: Express
let accountCollection: Collection
let surveyCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Alan',
    email: 'alanr.developer@hotmail.com',
    password: '123',
    role: 'admin'
  })

  const id = res.insertedId
  const accessToken = await sign({ id }, env.jwtSecret)

  await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })

  return accessToken
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__)
    app = await setupApp()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    it('Should return 403 if no access token is provided', async () => {
      await request(app).post('/api/surveys').send({
        question: 'Question',
        answers: [{
          answer: 'Answer',
          image: 'image'
        }, {
          answers: 'Answer 2'
        }]
      }).expect(403)
    })

    it('Should return 204 on add survey with valid access token is provided', async () => {
      const accessToken = await makeAccessToken()

      await request(app).post('/api/surveys').set('x-access-token', accessToken).send({
        question: 'Question',
        answers: [{
          answer: 'Answer',
          image: 'image'
        }, {
          answers: 'Answer 2'
        }]
      }).expect(204)
    })
  })

  describe('GET /surveys', () => {
    it('Should return 403 on load surveys without accessToken', async () => {
      await request(app).get('/api/surveys').expect(403)
    })

    it('Should return 204 on load surveys with valid accessToken', async () => {
      const accessToken = await makeAccessToken()

      await request(app).get('/api/surveys').set('x-access-token', accessToken).expect(204)
    })
  })
})
