import { describe, expect, it, vi } from 'vitest'
import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

vi.mock('bcrypt', async () => ({
  default: {
    async hash (data: string, saltOrRounds: number): Promise<string> {
      return await new Promise(resolve => resolve('hash'))
    }
  }
}))

const makeSut = (salt: number): BcryptAdapter => new BcryptAdapter(salt)

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const salt = 12
    const sut = makeSut(salt)
    const hashSpy = vi.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('Should return a hash on success', async () => {
    const sut = makeSut(12)

    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hash')
  })
})
