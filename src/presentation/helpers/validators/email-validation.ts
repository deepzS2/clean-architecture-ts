import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'
import { Validation } from './validation'

export class EmailValidation implements Validation {
  constructor (private readonly _fieldName: string, private readonly _emailValidator: EmailValidator) {}

  validate (input: any): Error | null {
    if (!this._emailValidator.isValid(input[this._fieldName])) {
      return new InvalidParamError(this._fieldName)
    }

    return null
  }
}
