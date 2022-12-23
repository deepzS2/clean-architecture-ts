import { Collection, ObjectId } from 'mongodb'
import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest'

import { SurveyModel } from '@/domain/models'
import { MongoHelper, SurveyResultMongoRepository } from '@/infra/database'

import { mockAddSurveyParams, mockAddAccountParams } from '../../../domain/mocks'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => new SurveyResultMongoRepository()

const mockSurvey = async (): Promise<SurveyModel> => {
  const model = mockAddSurveyParams()
  const res = await surveyCollection.insertOne(model)

  return MongoHelper.map<SurveyModel>(res.insertedId, model)
}

const mockAccountId = async (): Promise<string> => {
  const model = mockAddAccountParams()

  const res = await accountCollection.insertOne(model)

  return res.insertedId.toString()
}

describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    it('Should add a survey result if its new', async () => {
      const sut = makeSut()
      const survey = await mockSurvey()
      const accountId = await mockAccountId()

      await sut.save({
        answer: survey.answers[0].answer,
        date: new Date(),
        accountId,
        surveyId: survey.id
      })

      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId)
      })

      expect(surveyResult).toBeTruthy()
    })

    it('Should update survey result if its not new', async () => {
      const sut = makeSut()
      const survey = await mockSurvey()
      const accountId = await mockAccountId()

      await surveyResultCollection.insertOne({
        answer: survey.answers[0].answer,
        date: new Date(),
        accountId,
        surveyId: survey.id
      })

      await sut.save({
        answer: survey.answers[1].answer,
        date: new Date(),
        accountId,
        surveyId: survey.id
      })

      const surveyResult = await surveyResultCollection
        .find({
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId)
        })
        .toArray()

      expect(surveyResult).toBeTruthy()
      expect(surveyResult).toHaveLength(1)
    })
  })

  describe('loadBySurveyId()', () => {
    it('Should load a survey result', async () => {
      const sut = makeSut()
      const survey = await mockSurvey()
      const accountId = await mockAccountId()
      const accountId2 = await mockAccountId()

      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId2),
        answer: survey.answers[0].answer,
        date: new Date()
      }])
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId).toEqual(survey.id)
      expect(surveyResult?.answers[0].count).toBe(2)
      expect(surveyResult?.answers[0].percent).toBe(100)
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult?.answers[1].count).toBe(0)
      expect(surveyResult?.answers[1].percent).toBe(0)
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    it('Should load a survey result 2', async () => {
      const sut = makeSut()
      const survey = await mockSurvey()
      const accountId = await mockAccountId()
      const accountId2 = await mockAccountId()
      const accountId3 = await mockAccountId()

      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId2),
        answer: survey.answers[1].answer,
        date: new Date()
      },
      {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId3),
        answer: survey.answers[1].answer,
        date: new Date()
      }])
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId2)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId).toEqual(survey.id)
      expect(surveyResult?.answers[0].count).toBe(2)
      expect(surveyResult?.answers[0].percent).toBe(67)
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult?.answers[1].count).toBe(1)
      expect(surveyResult?.answers[1].percent).toBe(33)
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    it('Should load a survey result 3', async () => {
      const sut = makeSut()
      const survey = await mockSurvey()
      const accountId = await mockAccountId()
      const accountId2 = await mockAccountId()
      const accountId3 = await mockAccountId()

      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId2),
        answer: survey.answers[1].answer,
        date: new Date()
      }])
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId3)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId).toEqual(survey.id)
      expect(surveyResult?.answers[0].count).toBe(1)
      expect(surveyResult?.answers[0].percent).toBe(50)
      expect(surveyResult?.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult?.answers[1].count).toBe(1)
      expect(surveyResult?.answers[1].percent).toBe(50)
      expect(surveyResult?.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    it('Should return null if there is no survey result', async () => {
      const sut = makeSut()
      const survey = await mockSurvey()
      const accountId = await mockAccountId()

      const surveyResult = await sut.loadBySurveyId(survey.id, accountId)

      expect(surveyResult).toBeFalsy()
    })
  })
})
