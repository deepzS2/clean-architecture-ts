import { MissingParamError } from '../../errors'
import { Validation } from './validation'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly _fieldName: string) {}

  validate (input: any): Error | null {
    if (!input[this._fieldName]) {
      return new MissingParamError(this._fieldName)
    }

    return null
  }
}
