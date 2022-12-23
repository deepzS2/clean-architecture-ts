import jwt from 'jsonwebtoken'
import { describe, expect, it, vi } from 'vitest'

import { JwtAdapter } from '@/infra/criptography'

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: async (): Promise<string> => {
      return await Promise.resolve('any_token')
    },
    verify: async (): Promise<string> => {
      return await Promise.resolve('any_value')
    }
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('Jwt Adapter', () => {
  describe('Encrypt', () => {
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

    it('Should call sign with correct values', async () => {
      const sut = makeSut()
      vi.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.encrypt('any_id')

      await expect(promise).rejects.toThrow()
    })
  })

  describe('Decrypt', () => {
    it('Should call verify with correct values', async () => {
      const sut = makeSut()

      const verifySpy = vi.spyOn(jwt, 'verify')

      await sut.decrypt('any_id')

      expect(verifySpy).toHaveBeenCalledWith('any_id', 'secret')
    })

    it('Should return a value on verify success', async () => {
      const sut = makeSut()

      const value = await sut.decrypt('any_id')

      expect(value).toBe('any_value')
    })

    it('Should throw if verify throws', async () => {
      const sut = makeSut()
      vi.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error() })

      const promise = sut.decrypt('any_id')

      await expect(promise).rejects.toThrow()
    })
  })
})
