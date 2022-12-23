import MockDate from 'mockdate'
import { describe, expect, vi, it, beforeAll, afterAll } from 'vitest'

import { SaveSurveyResultController } from '@/presentation/controllers'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { faker } from '@faker-js/faker'

import { LoadSurveyByIdSpy, SaveSurveyResultSpy } from '../../presentation/mocks'

interface SutTypes {
  sut: SaveSurveyResultController
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  saveSurveyResultSpy: SaveSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy()
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const sut = new SaveSurveyResultController(loadSurveyByIdSpy, saveSurveyResultSpy)

  return { sut, loadSurveyByIdSpy, saveSurveyResultSpy }
}

const mockRequest = (answer?: string): SaveSurveyResultController.Request => ({
  surveyId: faker.datatype.uuid(),
  answer: answer ?? '',
  accountId: faker.datatype.uuid()
})

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()

    const request = mockRequest()
    await sut.handle(request)

    expect(loadSurveyByIdSpy.id).toBe(request.surveyId)
  })

  it('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    loadSurveyByIdSpy.surveyModel = null

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut()
    vi.spyOn(loadSurveyByIdSpy, 'loadById').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 403 if an invalid answers is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  it('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut()

    const request = mockRequest(loadSurveyByIdSpy.surveyModel?.answers[0].answer)
    await sut.handle(request)

    expect(saveSurveyResultSpy.saveSurveyResultParams).toEqual({
      surveyId: request.surveyId,
      accountId: request.accountId,
      date: new Date(),
      answer: request.answer
    })
  })

  it('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut()
    vi.spyOn(saveSurveyResultSpy, 'save').mockRejectedValueOnce(new Error())

    const request = mockRequest(loadSurveyByIdSpy.surveyModel?.answers[0].answer)
    const httpResponse = await sut.handle(request)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 200 on success', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut()

    const request = mockRequest(loadSurveyByIdSpy.surveyModel?.answers[0].answer)
    const httpResponse = await sut.handle(request)

    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.surveyResultModel))
  })
})
