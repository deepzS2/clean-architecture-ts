import { describe, expect, it, vi } from 'vitest'
import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

vi.mock('bcrypt', async () => ({
  default: {
    async hash (data: string, saltOrRounds: number): Promise<string> {
      return await Promise.resolve('hash')
    },
    async compare (): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
}))

const salt = 12
const makeSut = (salt: number): BcryptAdapter => new BcryptAdapter(salt)

describe('Bcrypt Adapter', () => {
  it('Should call hash with correct values', async () => {
    const sut = makeSut(salt)
    const hashSpy = vi.spyOn(bcrypt, 'hash')

    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('Should return a hash on hash success', async () => {
    const sut = makeSut(salt)

    const hash = await sut.hash('any_value')
    expect(hash).toBe('hash')
  })

  it('Should throws if hash throws', async () => {
    const sut = makeSut(salt)
    // @ts-expect-error
    vi.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })

  it('Should call compare with correct values', async () => {
    const sut = makeSut(salt)
    const hashSpy = vi.spyOn(bcrypt, 'compare')

    await sut.compare('any_value', 'any_hash')
    expect(hashSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  it('Should return true when compare succeeds', async () => {
    const sut = makeSut(salt)

    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBeTruthy()
  })

  it('Should return false when compare fails', async () => {
    const sut = makeSut(salt)
    // @ts-expect-error
    vi.spyOn(bcrypt, 'compare').mockReturnValueOnce(Promise.resolve(false))

    const isValid = await sut.compare('any_value', 'any_hash')
    expect(isValid).toBeFalsy()
  })

  it('Should throws if compare throws', async () => {
    const sut = makeSut(salt)
    // @ts-expect-error
    vi.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.compare('any_value', 'any_hash')
    await expect(promise).rejects.toThrow()
  })
})
