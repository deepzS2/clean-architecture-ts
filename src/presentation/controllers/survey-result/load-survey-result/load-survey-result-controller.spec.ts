import MockDate from 'mockdate'
import { describe, expect, vi, it, beforeAll, afterAll } from 'vitest'

import { mockLoadSurveyById } from '@/presentation/mocks'

import { LoadSurveyResultController } from './load-survey-result-controller'
import { HttpRequest, LoadSurveyById } from './load-survey-result-protocols'

interface SutTypes {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub)

  return { sut, loadSurveyByIdStub }
}

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = vi.spyOn(loadSurveyByIdStub, 'loadById')

    await sut.handle(mockRequest())

    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })
})
