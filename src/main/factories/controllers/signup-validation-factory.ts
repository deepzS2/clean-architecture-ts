import { EmailValidatorAdapter } from '@/infra/validators'
import { Validation } from '@/presentation/protocols'
import { RequiredFieldValidation, EmailValidation, ValidationComposite, CompareFieldsValidation } from '@/validation/validators'

export const makeSignUpValidation = (): ValidationComposite => {
  const emailValidator = new EmailValidatorAdapter()
  const validations: Validation[] = []

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(...validations, new CompareFieldsValidation('password', 'passwordConfirmation'), new EmailValidation('email', emailValidator))
}
