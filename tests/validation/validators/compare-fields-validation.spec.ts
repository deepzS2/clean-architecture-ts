import { describe, expect, it } from 'vitest'

import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from '@/validation/validators'
import { faker } from '@faker-js/faker'

const field = faker.random.word()
const fieldToCompare = faker.random.word()

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation(field, fieldToCompare)
}

describe('CompareFieldsValidation', () => {
  it('Should return an InvalidParamError if validation fails', () => {
    const sut = makeSut()

    const result = sut.validate({
      [field]: faker.random.word(),
      [fieldToCompare]: faker.random.word()
    })

    expect(result).toEqual(new InvalidParamError(fieldToCompare))
  })

  it('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const value = faker.random.word()

    const result = sut.validate({
      [field]: value,
      [fieldToCompare]: value
    })
    expect(result).toBeFalsy()
  })
})
