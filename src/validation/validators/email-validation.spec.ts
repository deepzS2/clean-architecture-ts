import { describe, expect, vi, it } from 'vitest'

import { InvalidParamError } from '@/presentation/errors'

import { mockEmailValidator } from '../mocks'
import { EmailValidator } from '../protocols/email-validator'
import { EmailValidation } from './email-validation'

interface SutTypes {
  emailValidatorStub: EmailValidator
  sut: EmailValidation
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)

  return {
    emailValidatorStub,
    sut
  }
}

describe('Email Validation', () => {
  it('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()

    vi.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const result = sut.validate({ email: 'any_email@mail.com' })
    expect(result).toEqual(new InvalidParamError('email'))
  })

  it('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = vi.spyOn(emailValidatorStub, 'isValid')

    sut.validate({ email: 'any_email@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()

    vi.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })
})
