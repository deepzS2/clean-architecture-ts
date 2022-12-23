import { faker } from '@faker-js/faker'

import { Decrypter } from '../protocols/criptography/decrypter'
import { Encrypter } from '../protocols/criptography/encrypter'
import { HashComparer } from '../protocols/criptography/hash-comparer'
import { Hasher } from '../protocols/criptography/hasher'

export class HasherSpy implements Hasher {
  digest = faker.datatype.uuid()
  plaintext: string

  async hash (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return await Promise.resolve(this.digest)
  }
}

export class DecrypterSpy implements Decrypter {
  plaintext: string | null = faker.internet.password()
  ciphertext: string

  async decrypt (ciphertext: string): Promise<string | null> {
    this.ciphertext = ciphertext

    return await Promise.resolve(this.plaintext)
  }
}

export class EncrypterSpy implements Encrypter {
  ciphertext = faker.datatype.uuid()
  plaintext: string

  async encrypt (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return await Promise.resolve(this.ciphertext)
  }
}
export class HashComparerSpy implements HashComparer {
  plaintext: string
  digest: string
  isValid = true

  async compare (plaintext: string, digest: string): Promise<boolean> {
    this.plaintext = plaintext
    this.digest = digest

    return await Promise.resolve(this.isValid)
  }
}
