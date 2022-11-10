import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
  constructor (private readonly _secret: string) {}

  async encrypt (value: string): Promise<string> {
    await jwt.sign({ id: value }, this._secret)
    return await Promise.resolve('')
  }
}
