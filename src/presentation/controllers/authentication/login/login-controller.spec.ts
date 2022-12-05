import { describe, expect, it, vi } from 'vitest'

import { MissingParamError } from '@/presentation/errors'
import { badRequest, serverError, unauthorized, ok } from '@/presentation/helpers/http/http-helper'
import { mockAuthentication, mockValidation } from '@/presentation/mocks'

import { LoginController } from './login-controller'
import { HttpRequest, Authentication, Validation } from './login-controller-protocols'

interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
  const sut = new LoginController(authenticationStub, validationStub)

  return {
    sut,
    authenticationStub,
    validationStub
  }
}

const mockRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

describe('Login Controller', () => {
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

  it('Should returns 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    vi.spyOn(authenticationStub, 'auth').mockResolvedValueOnce(null)

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  it('Should returns 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    vi.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const addSpy = vi.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    vi.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  it('Should 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
})
