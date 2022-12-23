import { describe, expect, it } from 'vitest'

import { LogControllerDecorator } from '@/main/decorators'
import { ok, serverError } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

import { LogErrorRepositorySpy } from '../../data/mocks'
import { mockAccountModel } from '../../domain/mocks'

interface SutTypes {
  sut: LogControllerDecorator
  controllerSpy: ControllerSpy
  logErrorRepositorySpy: LogErrorRepositorySpy
}

const mockServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'

  return serverError(fakeError)
}

class ControllerSpy implements Controller {
  httpResponse = ok(mockAccountModel())
  httpRequest: HttpRequest

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.httpRequest = httpRequest

    return await Promise.resolve(this.httpResponse)
  }
}

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy()
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy)

  return { sut, controllerSpy, logErrorRepositorySpy }
}

const mockRequest = (): HttpRequest => ({
  body: {
    email: 'any_mail@mail.com',
    name: 'any_name',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

describe('LogController Decorator', () => {
  it('Should call controller handle', async () => {
    const { sut, controllerSpy } = makeSut()
    const httpRequest = mockRequest()

    await sut.handle(httpRequest)
    expect(controllerSpy.httpRequest).toEqual(httpRequest)
  })

  it('Should return the same result of the controller', async () => {
    const { sut, controllerSpy } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(controllerSpy.httpResponse)
  })

  it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
    const serverError = mockServerError()
    controllerSpy.httpResponse = serverError

    await sut.handle(mockRequest())

    expect(logErrorRepositorySpy.stack).toBe(serverError.body.stack)
  })
})
