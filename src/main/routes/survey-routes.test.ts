import { it, describe, beforeEach, afterAll, beforeAll } from 'vitest'
import request from 'supertest'
import { MongoHelper } from '../../infra/database/mongodb/helpers/mongo-helper'
import { Express } from 'express'
import { setupApp } from '../config/app'
import { Collection } from 'mongodb'

let app: Express
let surveyCollection: Collection

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
  })

  describe('POST /surveys', () => {
    it('Should return 204 on add survey success', async () => {
      await request(app).post('/api/surveys').send({
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
})
