import { describe, expect, it } from 'vitest'

import { MissingParamError } from '@/presentation/errors'

import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe('RequiredField Validation', () => {
  it('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()

    const result = sut.validate({ name: 'any_name' })
    expect(result).toEqual(new MissingParamError('field'))
  })

  it('Should not return if validation succeeds', () => {
    const sut = makeSut()

    const result = sut.validate({ field: 'any_value' })
    expect(result).toBeFalsy()
  })
})
