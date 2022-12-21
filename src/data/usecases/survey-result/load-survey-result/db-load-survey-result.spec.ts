import MockDate from 'mockdate'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { mockLoadSurveyResultRepository } from '@/data/mocks'
import { mockSurveyResultModel } from '@/domain/mocks'

import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyResultRepository } from './db-load-survey-result-protocols'

interface SutTypes {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)

  return { sut, loadSurveyResultRepositoryStub }
}

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveyResultRepository', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = vi.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')

    await sut.load('any_survey_id')

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  it('Should throws if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    vi.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(new Error())

    const promise = sut.load('any_survey_id')
    await expect(promise).rejects.toThrow()
  })

  it('Should return SurveyResultModel on success', async () => {
    const { sut } = makeSut()

    const result = await sut.load('any_survey_id')

    expect(result).toEqual(mockSurveyResultModel())
  })
})
