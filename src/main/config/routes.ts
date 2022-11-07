import { Express, Router } from 'express'
import fg from 'fast-glob'

export default async (app: Express): Promise<void> => {
  const router = Router()
  app.use('/api', router)
  const routesPromises = fg.sync('**/src/main/routes/**routes.ts').map(async file => (await import(`../../../${file}`)).default(router))

  await Promise.all(routesPromises)
}
