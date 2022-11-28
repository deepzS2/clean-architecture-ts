import { describe, expect, it, vi } from 'vitest'

import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols/validation'

import { ValidationComposite } from './validation-composite'

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
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
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(...validationStubs)

  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  it('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    vi.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const result = sut.validate({ field: 'any_value' })
    expect(result).toEqual(new MissingParamError('field'))
  })

  it('Should return the first error if more then one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    vi.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    vi.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const result = sut.validate({ field: 'any_value' })
    expect(result).toEqual(new Error())
  })

  it('Should not return if validation succeeds', () => {
    const { sut } = makeSut()

    const result = sut.validate({ field: 'any_value' })
    expect(result).toBeFalsy()
  })
})
