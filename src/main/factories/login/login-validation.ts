import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const emailValidator = new EmailValidatorAdapter()
  const validations: Validation[] = []

  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(...validations, new EmailValidation('email', emailValidator))
}
