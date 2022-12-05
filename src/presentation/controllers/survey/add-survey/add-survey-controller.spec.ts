import MockDate from 'mockdate'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import { mockValidation } from '@/presentation/mocks'
import { mockAddSurvey } from '@/presentation/mocks'

import { AddSurveyController } from './add-survey-controller'
import { AddSurvey, Validation, HttpRequest } from './add-survey-protocols'

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addSurveyStub = mockAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)

  return { sut, validationStub, addSurveyStub }
}

const mockRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
})

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = vi.spyOn(validationStub, 'validate')

    const httpRequest = mockRequest()

    await sut.handle(httpRequest)

    expect(validateSpy)
  })

  it('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    vi.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())

    const httpRequest = mockRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  it('Should call AddSurveyUseCase with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = vi.spyOn(addSurveyStub, 'add')

    const httpRequest = mockRequest()

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return 500 if AddSurveyUseCase throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    vi.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 204 on success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(noContent())
  })
})
