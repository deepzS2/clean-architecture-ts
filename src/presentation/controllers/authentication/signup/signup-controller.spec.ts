import { describe, expect, it, vi, vitest } from 'vitest'

import { EmailInUseError, MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { AddAccountSpy, AuthenticationSpy, ValidationSpy } from '@/presentation/mocks'
import { faker } from '@faker-js/faker'

import { SignUpController } from './signup-controller'
import { HttpRequest } from './signup-controller-protocols'

interface SutTypes {
  sut: SignUpController
  addAccountSpy: AddAccountSpy
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const addAccountSpy = new AddAccountSpy()
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new SignUpController(addAccountSpy, validationSpy, authenticationSpy)

  return {
    sut,
    addAccountSpy,
    validationSpy,
    authenticationSpy
  }
}

const mockRequest = (): HttpRequest => {
  const password = faker.internet.password()

  return {
    body: {
      name: faker.name.fullName(),
      email: faker.internet.email(),
      password,
      passwordConfirmation: password
    }
  }
}

describe('SignUp Controller', () => {
  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()
    const httpRequest = mockRequest()

    await sut.handle(httpRequest)

    expect(addAccountSpy.addAccountParams).toEqual({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  it('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountSpy } = makeSut()
    addAccountSpy.accountModel = null

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut()

    vitest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  it('Should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const httpRequest = mockRequest()

    await sut.handle(httpRequest)

    expect(validationSpy.input).toEqual(httpRequest.body)
  })

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new MissingParamError(faker.random.word())

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })

  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()

    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(authenticationSpy.authenticationParams).toEqual({
      email: httpRequest.body.email,
      password: httpRequest.body.password
    })
  })

  it('Should returns 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    vi.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 200 if valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok(authenticationSpy.authenticationModel))
  })
})
