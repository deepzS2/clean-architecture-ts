import { describe, expect, it, vi } from 'vitest'
import { HttpRequest } from '../../../protocols'
import { AddSurveyController } from './add-survey-controller'
import { Validation } from './add-survey-protocols'

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const sut = new AddSurveyController(validationStub)

  return { sut, validationStub }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answer: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
})

describe('AddSurvey Controller', () => {
  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = vi.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validateSpy)
  })
})
