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

const salt = 12
const makeSut = (salt: number): BcryptAdapter => new BcryptAdapter(salt)

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const sut = makeSut(salt)
    const hashSpy = vi.spyOn(bcrypt, 'hash')

    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('Should return a hash on success', async () => {
    const sut = makeSut(salt)

    const hash = await sut.hash('any_value')
    expect(hash).toBe('hash')
  })

  it('Should throws if bcrypt throws', async () => {
    const sut = makeSut(salt)
    // @ts-expect-error
    vi.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise<string>((resolve, reject) => reject(new Error())))

    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })
})
