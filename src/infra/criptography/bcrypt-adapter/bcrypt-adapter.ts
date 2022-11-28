import bcrypt from 'bcrypt'

import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { Hasher } from '@/data/protocols/criptography/hasher'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly _salt: number) {}

  async hash (value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this._salt)

    return hashedValue
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const isEquals = await bcrypt.compare(value, hash)

    return isEquals
  }
}
