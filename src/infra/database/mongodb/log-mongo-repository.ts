import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'

import { MongoHelper } from '.'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorsCollection = await MongoHelper.getCollection('errors')

    await errorsCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
