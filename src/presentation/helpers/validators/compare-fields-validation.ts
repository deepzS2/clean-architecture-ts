import { InvalidParamError } from '../../errors'
import { Validation } from './validation'

export class CompareFieldsValidation implements Validation {
  constructor (private readonly _fieldName: string, private readonly _fieldToCompareName: string) {}

  validate (input: any): Error | null {
    if (input[this._fieldName] !== input[this._fieldToCompareName]) {
      return new InvalidParamError(this._fieldName)
    }

    return null
  }
}
