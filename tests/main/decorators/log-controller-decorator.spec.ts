import { describe, expect, it } from 'vitest'

import { LogControllerDecorator } from '@/main/decorators'
import { ok, serverError } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { faker } from '@faker-js/faker'

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
  request: any

  async handle (request: any): Promise<HttpResponse> {
    this.request = request

    return await Promise.resolve(this.httpResponse)
  }
}

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy()
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy)

  return { sut, controllerSpy, logErrorRepositorySpy }
}

describe('LogController Decorator', () => {
  it('Should call controller handle', async () => {
    const { sut, controllerSpy } = makeSut()
    const request = faker.lorem.sentence()

    await sut.handle(request)
    expect(controllerSpy.request).toEqual(request)
  })

  it('Should return the same result of the controller', async () => {
    const { sut, controllerSpy } = makeSut()

    const httpResponse = await sut.handle(faker.lorem.sentence())

    expect(httpResponse).toEqual(controllerSpy.httpResponse)
  })

  it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
    const serverError = mockServerError()
    controllerSpy.httpResponse = serverError

    await sut.handle(faker.lorem.sentence())

    expect(logErrorRepositorySpy.stack).toBe(serverError.body.stack)
  })
})
