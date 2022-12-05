import { describe, expect, it, vi, vitest } from 'vitest'

import { EmailInUseError, MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { mockAuthentication, mockValidation } from '@/presentation/mocks'
import { mockAddAccount } from '@/presentation/mocks'

import { SignUpController } from './signup-controller'
import { AddAccount, AccountModel, HttpRequest, Validation, Authentication } from './signup-controller-protocols'

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount()
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)

  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

describe('SignUp Controller', () => {
  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = vitest.spyOn(addAccountStub, 'add')

    await sut.handle(mockRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  it('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    vitest.spyOn(addAccountStub, 'add').mockResolvedValueOnce(null)

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    vitest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await Promise.reject<AccountModel>(new Error())
    })

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const addSpy = vitest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    vitest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = vi.spyOn(authenticationStub, 'auth')

    const httpRequest = mockRequest()
    const { email, password } = httpRequest.body

    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith({
      email,
      password
    })
  })

  it('Should returns 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    vi.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
})
