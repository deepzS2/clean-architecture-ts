import MockDate from 'mockdate'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { AddSurveyController } from '@/presentation/controllers'
import { badRequest, noContent, serverError } from '@/presentation/helpers'
import { HttpRequest } from '@/presentation/protocols'
import { faker } from '@faker-js/faker'

import { AddSurveySpy, ValidationSpy } from '../../presentation/mocks'

interface SutTypes {
  sut: AddSurveyController
  validationSpy: ValidationSpy
  addSurveySpy: AddSurveySpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addSurveySpy = new AddSurveySpy()
  const sut = new AddSurveyController(validationSpy, addSurveySpy)

  return { sut, validationSpy, addSurveySpy }
}

const mockRequest = (): HttpRequest => ({
  body: {
    question: faker.random.words(),
    answers: [{
      image: faker.image.imageUrl(),
      answer: faker.random.word()
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
    const { sut, validationSpy } = makeSut()

    const httpRequest = mockRequest()

    await sut.handle(httpRequest)

    expect(validationSpy.input).toEqual(httpRequest.body)
  })

  it('Should return 400 if Validation fails', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new Error()

    const httpRequest = mockRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })

  it('Should call AddSurveyUseCase with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()

    const httpRequest = mockRequest()

    await sut.handle(httpRequest)

    expect(addSurveySpy.addSurveyParams).toEqual(httpRequest.body)
  })

  it('Should return 500 if AddSurveyUseCase throws', async () => {
    const { sut, addSurveySpy } = makeSut()
    vi.spyOn(addSurveySpy, 'add').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 204 on success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(noContent())
  })
})
