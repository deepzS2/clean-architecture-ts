import { describe, expect, it, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: async (): Promise<string> => {
      return await Promise.resolve('any_token')
    }
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('Jwt Adapter', () => {
  it('Should call sign with correct values', async () => {
    const id = 'any_id'
    const sut = makeSut()
    const signSpy = vi.spyOn(jwt, 'sign')

    await sut.encrypt(id)

    expect(signSpy).toHaveBeenCalledWith({ id }, 'secret')
  })

  it('Should return a token on sign success', async () => {
    const sut = makeSut()
    const accessToken = await sut.encrypt('any_id')

    expect(accessToken).toBe('any_token')
  })
})
