import { Collection, ObjectId } from 'mongodb'
import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest'

import { AccountModel } from '@/domain/models/account'
import { SurveyModel } from '@/domain/models/survey'

import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => new SurveyResultMongoRepository()

const makeSurvey = async (): Promise<SurveyModel> => {
  const model = {
    question: 'any_question',
    answers: [{
      answer: 'any_answer_1',
      image: 'any_image'
    }, {
      answer: 'any_answer_2'
    }, {
      answer: 'any_answer_3'
    }],
    date: new Date()
  }

  const res = await surveyCollection.insertOne(model)

  return MongoHelper.map<SurveyModel>(res.insertedId, model)
}

const makeAccount = async (): Promise<AccountModel> => {
  const model = {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }

  const res = await accountCollection.insertOne(model)

  return MongoHelper.map<AccountModel>(res.insertedId, model)
}

describe('Survey Mongo Repository', () => {
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
      const survey = await makeSurvey()
      const account = await makeAccount()

      const surveyResult = await sut.save({
        answer: survey.answers[0].answer,
        date: new Date(),
        accountId: account.id,
        surveyId: survey.id
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId).toEqual(survey.id)
      expect(surveyResult?.answers[0].answer).toBe(survey.answers[0].answer)
      expect(surveyResult?.answers[0].count).toBe(1)
      expect(surveyResult?.answers[0].percent).toBe(100)
    })

    it('Should update survey result if its not new', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account = await makeAccount()

      await surveyResultCollection.insertOne({
        answer: survey.answers[0].answer,
        date: new Date(),
        accountId: account.id,
        surveyId: survey.id
      })

      const surveyResult = await sut.save({
        answer: survey.answers[1].answer,
        date: new Date(),
        accountId: account.id,
        surveyId: survey.id
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId).toEqual(survey.id)
      expect(surveyResult?.answers[0].answer).toBe(survey.answers[1].answer)
      expect(surveyResult?.answers[0].count).toBe(1)
      expect(surveyResult?.answers[0].percent).toBe(100)
    })
  })

  describe('loadBySurveyId()', () => {
    it('Should load a survey result', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account = await makeAccount()

      await surveyResultCollection.insertMany([{
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[0].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[1].answer,
        date: new Date()
      }, {
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(account.id),
        answer: survey.answers[1].answer,
        date: new Date()
      }])
      const surveyResult = await sut.loadBySurveyId(survey.id)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.surveyId).toEqual(survey.id)
      expect(surveyResult?.answers[0].count).toBe(2)
      expect(surveyResult?.answers[0].percent).toBe(50)
      expect(surveyResult?.answers[1].count).toBe(2)
      expect(surveyResult?.answers[1].percent).toBe(50)
      expect(surveyResult?.answers[2].count).toBe(0)
      expect(surveyResult?.answers[2].percent).toBe(0)
    })
  })
})
