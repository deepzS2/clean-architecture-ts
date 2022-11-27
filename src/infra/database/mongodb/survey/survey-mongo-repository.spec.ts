import { Collection } from 'mongodb'
import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository()

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
  })

  it('Should add a survey on success', async () => {
    const sut = makeSut()

    await sut.add({
      question: 'any_question',
      answers: [{
        answer: 'any_answer',
        image: 'any_image'
      }, {
        answer: 'other_answer'
      }],
      date: new Date()
    })

    const survey = await surveyCollection.findOne({ question: 'any_question' })

    expect(survey).toBeTruthy()
  })
})
