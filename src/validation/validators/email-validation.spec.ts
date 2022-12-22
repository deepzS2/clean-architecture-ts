import { describe, expect, vi, it } from 'vitest'

import { InvalidParamError } from '@/presentation/errors'
import { faker } from '@faker-js/faker'

import { EmailValidatorSpy } from '../mocks'
import { EmailValidation } from './email-validation'

interface SutTypes {
  emailValidatorSpy: EmailValidatorSpy
  sut: EmailValidation
}

const field = faker.random.word()

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new EmailValidation(field, emailValidatorSpy)

  return {
    emailValidatorSpy,
    sut
  }
}

describe('Email Validation', () => {
  it('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false

    const email = faker.internet.email()
    const error = sut.validate({ [field]: email })

    expect(error).toEqual(new InvalidParamError(field))
  })

  it('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorSpy } = makeSut()
    const email = faker.internet.email()

    sut.validate({ [field]: email })
    expect(emailValidatorSpy.email).toBe(email)
  })

  it('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorSpy } = makeSut()

    vi.spyOn(emailValidatorSpy, 'isValid').mockRejectedValueOnce(new Error())

    expect(sut.validate).toThrow()
  })
})
