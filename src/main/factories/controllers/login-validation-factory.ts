import { EmailValidatorAdapter } from '@/infra/validators'
import { Validation } from '@/presentation/protocols'
import { RequiredFieldValidation, EmailValidation, ValidationComposite } from '@/validation/validators'

export const makeLoginValidation = (): ValidationComposite => {
  const emailValidator = new EmailValidatorAdapter()
  const validations: Validation[] = []

  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(...validations, new EmailValidation('email', emailValidator))
}
