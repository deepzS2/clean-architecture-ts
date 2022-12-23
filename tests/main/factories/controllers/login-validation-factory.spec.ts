import { describe, expect, it, vi } from 'vitest'

import { EmailValidatorAdapter } from '@/infra/validators'
import { makeLoginValidation } from '@/main/factories'
import { Validation } from '@/presentation/protocols'
import { RequiredFieldValidation, EmailValidation, ValidationComposite } from '@/validation/validators'

vi.mock('@/validation/validators/validation-composite')

describe('LoginValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()

    const emailValidator = new EmailValidatorAdapter()
    const validations: Validation[] = []

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(...validations, new EmailValidation('email', emailValidator))
  })
})
