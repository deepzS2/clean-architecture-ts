import 'module-alias/register'

import { MongoHelper } from '@/infra/database'

import { setupApp } from './config/app'
import env from './config/env'

async function bootstrap (): Promise<void> {
  try {
    await MongoHelper.connect(env.mongoUrl)

    // const { setupApp } = await import('./config/app')
    const app = await setupApp()

    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
  } catch (error) {
    console.error(error)
  }
}

void bootstrap()
