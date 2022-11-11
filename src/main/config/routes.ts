import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path'

export default async (app: Express): Promise<void> => {
  const routesPath = path.join(__dirname, '..', 'routes')

  const router = Router()
  app.use('/api', router)

  const routesPromises = readdirSync(routesPath).map(async file => {
    if (!file.includes('.test.')) {
      const { default: routesFunc } = await import(`../routes/${file}`)

      routesFunc(router)
    }
  })

  await Promise.all(routesPromises)
}
