import { Collection } from 'mongodb'
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
      answer: 'any_answer',
      image: 'any_image'
    }, {
      answer: 'other_answer'
    }],
    date: new Date()
  }

  const res = await surveyCollection.insertOne(model)

  return { id: res.insertedId.toString(), ...model }
}

const makeAccount = async (): Promise<AccountModel> => {
  const model = {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }

  const res = await accountCollection.insertOne(model)

  return { id: res.insertedId.toString(), ...model }
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

    surveyResultCollection = await MongoHelper.getCollection('surveysResults')
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
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(survey.answers[0].answer)
    })

    it('Should update survey result if its not new', async () => {
      const sut = makeSut()
      const survey = await makeSurvey()
      const account = await makeAccount()

      const res = await surveyResultCollection.insertOne({
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
      expect(surveyResult.id).toEqual(res.insertedId.toString())
      expect(surveyResult.answer).toBe(survey.answers[1].answer)
    })
  })
})
