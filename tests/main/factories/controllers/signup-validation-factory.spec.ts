import { describe, expect, it, vi } from 'vitest'

import { EmailValidatorAdapter } from '@/infra/validators'
import { makeSignUpValidation } from '@/main/factories'
import { Validation } from '@/presentation/protocols'
import { RequiredFieldValidation, EmailValidation, ValidationComposite, CompareFieldsValidation } from '@/validation/validators'

vi.mock('@/validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()

    const emailValidator = new EmailValidatorAdapter()
    const validations: Validation[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(...validations, new CompareFieldsValidation('password', 'passwordConfirmation'), new EmailValidation('email', emailValidator))
  })
})
