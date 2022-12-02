import { describe, expect, vi, it } from 'vitest'

import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'

import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest, LoadSurveyById, SurveyModel } from './save-survey-result-protocols'

interface SutTypes {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel | null> {
      return await Promise.resolve(makeFakeSurvey())
    }
  }

  return new LoadSurveyByIdStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub)

  return { sut, loadSurveyByIdStub }
}

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }
})

describe('SaveSurveyResult Controller', () => {
  it('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = vi.spyOn(loadSurveyByIdStub, 'loadById')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(loadByIdSpy).toHaveBeenCalledWith(httpRequest.params.surveyId)
  })

  it('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    vi.spyOn(loadSurveyByIdStub, 'loadById').mockResolvedValueOnce(null)

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    vi.spyOn(loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
