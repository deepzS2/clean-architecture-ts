import bcrypt from 'bcrypt'
import { Hasher } from '../../data/protocols/criptography/hasher'

export class BcryptAdapter implements Hasher {
  constructor (private readonly _salt: number) {}

  async hash (value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this._salt)

    return hashedValue
  }
}
