import jwt from 'jsonwebtoken'

import { Decrypter, Encrypter } from '@/data/protocols'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly _secret: string) {}

  async decrypt (ciphertext: string): Promise<string | null> {
    const value = await jwt.verify(ciphertext, this._secret) as string

    return value
  }

  async encrypt (plaintext: string): Promise<string> {
    return jwt.sign({ id: plaintext }, this._secret)
  }
}
