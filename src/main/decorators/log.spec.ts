import { LogControllerDecorator } from './log'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { describe, expect, it, vi } from 'vitest'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

class ControllerStub implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await new Promise(resolve => resolve({
      body: {
        name: 'Rodrigo'
      },
      statusCode: 200
    }))
  }
}

const makeSut = (): SutTypes => {
  const controllerStub = new ControllerStub()
  const sut = new LogControllerDecorator(controllerStub)

  return { sut, controllerStub }
}

describe('LogController Decorator', () => {
  it('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = vi.spyOn(controllerStub, 'handle')

    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('Should return the same result of the controller', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const result = await sut.handle(httpRequest)

    expect(result).toEqual({
      body: {
        name: 'Rodrigo'
      },
      statusCode: 200
    })
  })
})
