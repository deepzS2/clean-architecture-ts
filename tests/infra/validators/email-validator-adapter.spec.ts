import validator from 'validator'
import { describe, expect, it, vitest } from 'vitest'

import { EmailValidatorAdapter } from '@/infra/validators'

vitest.mock('validator', async () => (
  {
    default: {
      isEmail (): boolean {
        return true
      }
    }
  }
))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidatorAdapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = makeSut()
    vitest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValidEmail = sut.isValid('invalid_email@mail.com')
    expect(isValidEmail).not.toBeTruthy()
  })

  it('Should return false if validator returns true', () => {
    const sut = makeSut()

    const isValidEmail = sut.isValid('valid_email@mail.com')
    expect(isValidEmail).toBeTruthy()
  })

  it('Should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = vitest.spyOn(validator, 'isEmail')

    sut.isValid('any_email@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
