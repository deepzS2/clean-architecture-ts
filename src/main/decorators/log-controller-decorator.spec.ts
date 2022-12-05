import { describe, expect, it, vi } from 'vitest'

import { mockLogErrorRepository } from '@/data/mocks'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { mockAccountModel } from '@/domain/mocks'
import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

import { LogControllerDecorator } from './log-controller-decorator'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'

  return serverError(fakeError)
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(ok(mockAccountModel()))
    }
  }

  return new ControllerStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return { sut, controllerStub, logErrorRepositoryStub }
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
    const { sut, controllerStub } = makeSut()
    const handleSpy = vi.spyOn(controllerStub, 'handle')

    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('Should return the same result of the controller', async () => {
    const { sut } = makeSut()

    const result = await sut.handle(mockRequest())

    expect(result).toEqual(ok(mockAccountModel()))
  })

  it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const logSpy = vi.spyOn(logErrorRepositoryStub, 'logError')

    vi.spyOn(controllerStub, 'handle').mockResolvedValueOnce(makeFakeServerError())

    await sut.handle(mockRequest())

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
