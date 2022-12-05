import MockDate from 'mockdate'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { mockLoadSurveysRepository } from '@/data/mocks'
import { mockSurveyModels } from '@/domain/mocks'

import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository } from './db-load-surveys-protocols'

interface SutTypes {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

  return { sut, loadSurveysRepositoryStub }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadAllSpy = vi.spyOn(loadSurveysRepositoryStub, 'loadAll')

    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })

  it('Should return a list of Surveys on success', async () => {
    const { sut } = makeSut()

    const surveys = await sut.load()
    expect(surveys).toEqual(mockSurveyModels())
  })

  it('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    vi.spyOn(loadSurveysRepositoryStub, 'loadAll').mockRejectedValueOnce(new Error())

    const promise = sut.load()

    await expect(promise).rejects.toThrow()
  })
})
