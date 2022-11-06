import { MongoHelper } from '../infra/database/mongodb/helpers/mongo-helper'
import env from './config/env'

async function bootstrap (): Promise<void> {
  try {
    await MongoHelper.connect(env.mongoUrl)

    const { default: app } = await import('./config/app')

    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
  } catch (error) {
    console.error(error)
  }
}

void bootstrap()
