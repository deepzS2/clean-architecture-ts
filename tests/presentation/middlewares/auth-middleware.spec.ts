import { describe, expect, it, vi } from 'vitest'

import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { AuthMiddleware } from '@/presentation/middlewares'
import { HttpRequest } from '@/presentation/protocols'

import { LoadAccountByTokenSpy } from '../mocks'

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenSpy: LoadAccountByTokenSpy
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenSpy = new LoadAccountByTokenSpy()
  const sut = new AuthMiddleware(loadAccountByTokenSpy, role)

  return { sut, loadAccountByTokenSpy }
}

const mockRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

describe('Auth Middleware', () => {
  it('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      headers: {}
    })

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should call LoadAccountByToken with correct token', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenSpy } = makeSut(role)

    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(loadAccountByTokenSpy.accessToken).toBe(httpRequest.headers['x-access-token'])
    expect(loadAccountByTokenSpy.role).toBe(role)
  })

  it('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    loadAccountByTokenSpy.accountModel = null

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()
    vi.spyOn(loadAccountByTokenSpy, 'load').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut()

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(ok({
      accountId: loadAccountByTokenSpy.accountModel?.id
    }))
  })
})
