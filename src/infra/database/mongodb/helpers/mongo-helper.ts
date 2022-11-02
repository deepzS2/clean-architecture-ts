import { Collection, MongoClient, Document } from 'mongodb'

export class MongoHelper {
  public static client: MongoClient

  static async connect (url?: string): Promise<void> {
    this.client = await MongoClient.connect(url ?? '')
  }

  static async disconnect (): Promise<void> {
    await this.client.close()
  }

  static getCollection<T extends Document> (name: string): Collection<T> {
    return this.client.db().collection<T>(name)
  }
}
