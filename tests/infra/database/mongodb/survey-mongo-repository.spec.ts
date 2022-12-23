import FakeObjectId from 'bson-objectid'
import { Collection, ObjectId } from 'mongodb'
import { describe, beforeAll, afterAll, beforeEach, it, expect } from 'vitest'

import { MongoHelper, SurveyMongoRepository } from '@/infra/database'

import { mockAddAccountParams, mockAddSurveyParams } from '../../../domain/mocks'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const mockAccountId = async (): Promise<string> => {
  const model = mockAddAccountParams()

  const res = await accountCollection.insertOne(model)

  return res.insertedId.toString()
}

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository()

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

  describe('add()', () => {
    it('Should add a survey on success', async () => {
      const sut = makeSut()

      await sut.add(mockAddSurveyParams())

      const count = await surveyCollection.countDocuments()

      expect(count).toBe(1)
    })
  })

  describe('loadAll()', () => {
    it('Should load all surveys on success', async () => {
      const accountId = await mockAccountId()
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      const surveysMocked = await surveyCollection.insertMany(addSurveyModels)

      const survey = await surveyCollection.findOne({ _id: surveysMocked.insertedIds[0] })
      await surveyResultCollection.insertOne({
        surveyId: survey?._id,
        accountId: new ObjectId(accountId),
        answer: survey?.answers[0].answer,
        date: new Date()
      })

      const sut = makeSut()

      const surveys = await sut.loadAll(accountId)

      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyModels[0].question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe(addSurveyModels[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    it('Should load empty list', async () => {
      const accountId = await mockAccountId()
      const sut = makeSut()

      const surveys = await sut.loadAll(accountId)

      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    it('Should load survey by id on success', async () => {
      const { insertedId } = await surveyCollection.insertOne(mockAddSurveyParams())

      const sut = makeSut()

      const survey = await sut.loadById(insertedId.toString())

      expect(survey).toBeTruthy()
    })

    it('Should return null if survey does not exists', async () => {
      const sut = makeSut()

      const survey = await sut.loadById(FakeObjectId().str)

      expect(survey).toBeFalsy()
    })
  })

  describe('loadAnswers()', () => {
    it('Should load answers on success', async () => {
      const { insertedId } = await surveyCollection.insertOne(mockAddSurveyParams())
      const survey = await surveyCollection.findOne({ _id: insertedId })

      const sut = makeSut()

      const answers = await sut.loadAnswers(insertedId.toString())

      expect(answers).toEqual([survey?.answers[0].answer, survey?.answers[1].answer])
    })

    it('Should return empty array if survey does not exists', async () => {
      const sut = makeSut()

      const survey = await sut.loadAnswers(FakeObjectId().str)

      expect(survey).toEqual([])
    })
  })

  describe('checkById()', () => {
    it('Should return true if survey exists', async () => {
      const { insertedId } = await surveyCollection.insertOne(mockAddSurveyParams())

      const sut = makeSut()

      const survey = await sut.checkById(insertedId.toString())

      expect(survey).toBeTruthy()
    })

    it('Should return false if survey not exists', async () => {
      const sut = makeSut()

      const survey = await sut.checkById(FakeObjectId().str)

      expect(survey).toBeFalsy()
    })
  })
})
