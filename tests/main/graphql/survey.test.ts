import { Express } from 'express'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import { it, describe, beforeEach, afterAll, beforeAll, expect } from 'vitest'

import { MongoHelper } from '@/infra/database'
import { setupApp } from '@/main/config/app'
import env from '@/main/config/env'

let app: Express
let surveyCollection: Collection
let accountCollection: Collection

const mockAccessToken = async (): Promise<string> => {
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

describe('Survey GraphQL', () => {
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

  describe('Surveys Query', () => {
    const surveysQuery = `
      query {
        surveys {
          id
          question
          answers {
            image
            answer
          }
          date
          didAnswer
        }
      }
    `

    it('Should return surveys', async () => {
      const accessToken = await mockAccessToken()
      const now = new Date()

      await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'image'
        }, {
          answer: 'Answer 2'
        }],
        date: now
      })

      const result = await request(app).post('/graphql').set('x-access-token', accessToken).send({ query: surveysQuery })

      expect(result.status).toBe(200)
      expect(result.body.data.surveys.length).toBe(1)
      expect(result.body.data.surveys[0].id).toBeTruthy()
      expect(result.body.data.surveys[0].question).toBe('Question')
      expect(result.body.data.surveys[0].date).toBe(now.toISOString())
      expect(result.body.data.surveys[0].didAnswer).toBeFalsy()
    })

    it('Should return AccessDeniedError if no token is provided', async () => {
      const now = new Date()

      await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'image'
        }, {
          answer: 'Answer 2'
        }],
        date: now
      })

      const result = await request(app).post('/graphql').send({ query: surveysQuery })

      expect(result.status).toBe(403)
      expect(result.body.data).toBeFalsy()
      expect(result.body.errors[0].message).toBe('Access denied')
    })
  })
})
