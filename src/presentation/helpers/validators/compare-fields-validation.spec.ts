import { describe, expect, it } from 'vitest'
import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('CompareFields Validation', () => {
  it('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()

    const result = sut.validate({ field: 'any_value', fieldToCompare: 'wrong_value' })
    expect(result).toEqual(new InvalidParamError('field'))
  })

  it('Should not return if validation succeeds', () => {
    const sut = makeSut()

    const result = sut.validate({ field: 'any_value', fieldToCompare: 'any_value' })
    expect(result).toBeFalsy()
  })
})
