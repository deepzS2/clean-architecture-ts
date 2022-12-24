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

describe('SurveyResult GraphQL', () => {
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

  describe('SurveyResult Query', () => {
    const surveyResultQuery = (surveyId: string): string => `
      query {
        surveyResult(surveyId: "${surveyId}") {
          surveyId
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
    `

    it('Should return SurveyResult', async () => {
      const accessToken = await mockAccessToken()
      const now = new Date()

      const { insertedId: surveyId } = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'image'
        }, {
          answer: 'Answer 2'
        }],
        date: now
      })

      const result = await request(app).post('/graphql').set('x-access-token', accessToken).send({ query: surveyResultQuery(surveyId.toString()) })

      console.log(result.body.errors)

      expect(result.status).toBe(200)
      expect(result.body.data.surveyResult.question).toBe('Question')
      expect(result.body.data.surveyResult.date).toBe(now.toISOString())
      expect(result.body.data.surveyResult.answers).toEqual([
        {
          answer: 'Answer 1',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        },
        {
          answer: 'Answer 2',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }
      ])
    })

    it('Should return AccessDeniedError if no token is provided', async () => {
      const now = new Date()

      const { insertedId: surveyId } = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'image'
        }, {
          answer: 'Answer 2'
        }],
        date: now
      })

      const result = await request(app).post('/graphql').send({ query: surveyResultQuery(surveyId.toString()) })

      expect(result.status).toBe(403)
      expect(result.body.data).toBeFalsy()
      expect(result.body.errors[0].message).toBe('Access denied')
    })
  })
})
