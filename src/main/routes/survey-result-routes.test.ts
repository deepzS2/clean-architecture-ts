import { Express } from 'express'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import { it, describe, beforeEach, afterAll, beforeAll } from 'vitest'

import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper'
import { setupApp } from '@/main/config/app'

import env from '../config/env'

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

describe('Survey Result Routes', () => {
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

  describe('PUT /surveys/:surveyId/results', () => {
    it('Should return 403 on save survey result if no access token is provided', async () => {
      await request(app).put('/api/surveys/any_id/results').send({
        answer: 'any_answer'
      }).expect(403)
    })

    it('Should return 200 on save survey result with accessToken', async () => {
      const res = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'image'
        }, {
          answer: 'Answer 2'
        }],
        date: new Date()
      })

      const accessToken = await makeAccessToken()

      await request(app)
        .put(`/api/surveys/${res.insertedId.toString()}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1'
        })
        .expect(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    it('Should return 403 on save survey result if no access token is provided', async () => {
      await request(app).get('/api/surveys/any_id/results').expect(403)
    })

    it('Should return 200 on load survey result with access token', async () => {
      const accessToken = await makeAccessToken()

      const result = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com'
        }, {
          answer: 'Answer 2'
        }],
        date: new Date()
      })

      await request(app)
        .get(`/api/surveys/${result.insertedId.toString()}/results`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
