import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/criptography/decrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly _secret: string) {}

  async decrypt (value: string): Promise<string | null> {
    await jwt.verify(value, this._secret)

    return null
  }

  async encrypt (value: string): Promise<string> {
    return jwt.sign({ id: value }, this._secret)
  }
}
