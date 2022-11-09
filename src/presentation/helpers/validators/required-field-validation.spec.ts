import { describe, expect, it } from 'vitest'
import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (fieldName: string): RequiredFieldValidation => {
  return new RequiredFieldValidation(fieldName)
}

describe('RequiredField Validation', () => {
  it('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut('field')

    const result = sut.validate({ name: 'any_name' })
    expect(result).toEqual(new MissingParamError('field'))
  })
})
