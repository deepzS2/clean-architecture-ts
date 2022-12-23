import MockDate from 'mockdate'
import { afterAll, beforeEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { DbLoadSurveyResult } from '@/data/usecases'
import { faker } from '@faker-js/faker'

import { LoadSurveyByIdRepositorySpy, LoadSurveyResultRepositorySpy } from '../mocks'

interface SutTypes {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy)

  return { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy }
}

let surveyId: string
let accountId: string

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  beforeEach(() => {
    surveyId = faker.datatype.uuid()
    accountId = faker.datatype.uuid()
  })

  it('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    await sut.load(surveyId, accountId)

    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyId)
    expect(loadSurveyResultRepositorySpy.accountId).toBe(accountId)
  })

  it('Should throws if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    vi.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockRejectedValueOnce(new Error())

    const promise = sut.load(surveyId, accountId)
    await expect(promise).rejects.toThrow()
  })

  it('Should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyResultRepositorySpy.surveyResultModel = null

    await sut.load(surveyId, accountId)
    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  it('Should return SurveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyResultRepositorySpy.surveyResultModel = null

    const surveyResult = await sut.load(surveyId, accountId)
    const { surveyModel } = loadSurveyByIdRepositorySpy

    expect(surveyResult).toEqual({
      surveyId: surveyModel?.id,
      question: surveyModel?.question,
      date: surveyModel?.date,
      answers: surveyModel?.answers.map(answer => Object.assign({}, answer, {
        count: 0,
        percent: 0,
        isCurrentAccountAnswer: false
      }))
    })
  })

  it('Should return null if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositorySpy, loadSurveyResultRepositorySpy } = makeSut()

    loadSurveyByIdRepositorySpy.surveyModel = null
    loadSurveyResultRepositorySpy.surveyResultModel = null

    const result = await sut.load(surveyId, accountId)

    expect(result).toBeFalsy()
  })

  it('Should return SurveyResultModel on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyResult = await sut.load(surveyId, accountId)

    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.surveyResultModel)
  })
})
