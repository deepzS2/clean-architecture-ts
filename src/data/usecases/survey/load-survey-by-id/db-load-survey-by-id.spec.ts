import MockDate from 'mockdate'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { LoadSurveyByIdRepositorySpy } from '@/data/mocks'
import { faker } from '@faker-js/faker'

import { DbLoadSurveyById } from './db-load-survey-by-id'

interface SutTypes {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy)

  return { sut, loadSurveyByIdRepositorySpy }
}

let surveyId: string

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  beforeEach(() => {
    surveyId = faker.datatype.uuid()
  })

  it('Should call LoadSurveyByIdRepository with correct value', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    await sut.loadById(surveyId)

    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  it('Should return a Survey on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const survey = await sut.loadById(surveyId)

    expect(survey).toEqual(loadSurveyByIdRepositorySpy.surveyModel)
  })

  it('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    vi.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockRejectedValueOnce(new Error())

    const promise = sut.loadById('any_id')

    await expect(promise).rejects.toThrow()
  })
})
