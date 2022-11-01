import { describe, expect, it } from 'vitest'
import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()

    const isValidEmail = sut.isValid('invalid_email@mail.com')
    expect(isValidEmail).not.toBeTruthy()
  })
})
