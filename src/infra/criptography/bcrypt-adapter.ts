import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/criptography/encrypter'

export class BcryptAdapter implements Encrypter {
  constructor (private readonly _salt: number) {}

  async encrypt (value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this._salt)

    return hashedValue
  }
}
