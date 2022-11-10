import { describe, expect, it, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

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
})
