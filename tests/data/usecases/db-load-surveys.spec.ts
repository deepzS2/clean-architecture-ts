import MockDate from 'mockdate'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { DbLoadSurveys } from '@/data/usecases'
import { faker } from '@faker-js/faker'

import { LoadSurveysRepositorySpy } from '../mocks'

interface SutTypes {
  sut: DbLoadSurveys
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy()
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy)

  return { sut, loadSurveysRepositorySpy }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveysRepository with correct values', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const accountId = faker.datatype.uuid()

    await sut.load(accountId)
    expect(loadSurveysRepositorySpy.accountId).toBe(accountId)
  })

  it('Should return a list of Surveys on success', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const accountId = faker.datatype.uuid()

    const surveys = await sut.load(accountId)
    expect(surveys).toEqual(loadSurveysRepositorySpy.surveyModels)
  })

  it('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut()
    const accountId = faker.datatype.uuid()
    vi.spyOn(loadSurveysRepositorySpy, 'loadAll').mockRejectedValueOnce(new Error())

    const promise = sut.load(accountId)

    await expect(promise).rejects.toThrow()
  })
})
