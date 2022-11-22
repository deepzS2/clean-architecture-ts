import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/criptography/decrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly _secret: string) {}

  async decrypt (token: string): Promise<string | null> {
    const value = await jwt.verify(token, this._secret) as string

    return value
  }

  async encrypt (value: string): Promise<string> {
    return jwt.sign({ id: value }, this._secret)
  }
}
