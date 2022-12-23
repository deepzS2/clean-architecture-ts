import { describe, expect, it } from 'vitest'

import { MissingParamError } from '@/presentation/errors'
import { RequiredFieldValidation } from '@/validation/validators'
import { faker } from '@faker-js/faker'

const field = faker.random.word()

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation(field)
}

describe('RequiredField Validation', () => {
  it('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()

    const result = sut.validate({ invalidField: faker.random.word() })
    expect(result).toEqual(new MissingParamError(field))
  })

  it('Should not return if validation succeeds', () => {
    const sut = makeSut()

    const result = sut.validate({ [field]: faker.random.word() })
    expect(result).toBeFalsy()
  })
})
