import { InvalidParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols/validation'

import { EmailValidator } from '../protocols/email-validator'

export class EmailValidation implements Validation {
  constructor (private readonly _fieldName: string, private readonly _emailValidator: EmailValidator) {}

  validate (input: any): Error | null {
    if (!this._emailValidator.isValid(input[this._fieldName])) {
      return new InvalidParamError(this._fieldName)
    }

    return null
  }
}
