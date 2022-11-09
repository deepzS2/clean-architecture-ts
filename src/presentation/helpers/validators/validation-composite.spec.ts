import { describe, expect, it } from 'vitest'
import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

const makeSut = (): ValidationComposite => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return new MissingParamError('field')
    }
  }

  return new ValidationComposite(new ValidationStub())
}

describe('Validation Composite', () => {
  it('Should return an error if any validation fails', () => {
    const sut = makeSut()

    const result = sut.validate({ field: 'any_value' })
    expect(result).toEqual(new MissingParamError('field'))
  })
})
