import MockDate from 'mockdate'
import { it, describe, vi, expect, beforeAll, afterAll } from 'vitest'

import { mockLoadSurveyResultRepository, mockSaveSurveyResultRepository } from '@/data/mocks'
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/domain/mocks'

import { DbSaveSurveyResult } from './db-save-survey-result'
import { LoadSurveyResultRepository, SaveSurveyResultRepository } from './db-save-survey-result-protocols'

interface SutTypes {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)

  return { sut, saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub }
}

describe('DbSaveSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = vi.spyOn(saveSurveyResultRepositoryStub, 'save')
    const surveyResultData = mockSaveSurveyResultParams()

    await sut.save(surveyResultData)

    expect(saveSpy).toHaveBeenCalledWith(surveyResultData)
  })

  it('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = vi.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    const surveyResultData = mockSaveSurveyResultParams()

    await sut.save(surveyResultData)

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyResultData.surveyId)
  })

  it('Should return SurveyResult on success', async () => {
    const { sut } = makeSut()

    const surveyResult = await sut.save(mockSaveSurveyResultParams())

    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  it('Should throws if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    vi.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockRejectedValueOnce(new Error())

    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  it('Should throws if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    vi.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())

    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })
})
