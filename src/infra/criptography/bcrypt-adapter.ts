import bcrypt from 'bcrypt'

import { HashComparer, Hasher } from '@/data/protocols'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly _salt: number) {}

  async hash (plaintext: string): Promise<string> {
    const hashedValue = await bcrypt.hash(plaintext, this._salt)

    return hashedValue
  }

  async compare (plaintext: string, digest: string): Promise<boolean> {
    const isEquals = await bcrypt.compare(plaintext, digest)

    return isEquals
  }
}
