import { ObjectId } from 'mongodb'

import { AddAccountRepository, CheckAccountByEmailRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository } from '@/data/protocols'

import { MongoHelper } from '.'

export class AccountMongoRepository implements AddAccountRepository, CheckAccountByEmailRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository {
  async add (data: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(data)

    return result.insertedId !== null
  };

  async checkByEmail (email: string): Promise<boolean> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email }, { projection: { _id: 1 } })

    return account !== null
  }

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email }, {
      projection: {
        _id: 1,
        name: 1,
        password: 1
      }
    })

    if (!account) return null

    return MongoHelper.map<LoadAccountByEmailRepository.Result>(account._id, account)
  }

  async loadByToken (token: string, role?: string | undefined): Promise<LoadAccountByTokenRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    }, {
      projection: {
        _id: 1
      }
    })

    if (!account) return null

    return MongoHelper.map<LoadAccountByTokenRepository.Result>(account._id, account)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.findOneAndUpdate({
      _id: new ObjectId(id)
    }, {
      $set: {
        accessToken: token
      }
    })
  }
}
