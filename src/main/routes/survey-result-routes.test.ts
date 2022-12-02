import { Express } from 'express'
import { Collection } from 'mongodb'
import request from 'supertest'
import { it, describe, beforeEach, afterAll, beforeAll } from 'vitest'

import { MongoHelper } from '@/infra/database/mongodb/helpers/mongo-helper'
import { setupApp } from '@/main/config/app'

let app: Express
let accountCollection: Collection
let surveyCollection: Collection

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
  })
})
