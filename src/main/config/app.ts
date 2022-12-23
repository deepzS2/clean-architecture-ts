import express, { Express } from 'express'

import setupApolloServer from './apollo-server'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import setupStaticFiles from './static-files'
import setupSwagger from './swagger'

export const setupApp = async (): Promise<Express> => {
  const app = express()

  await setupApolloServer(app)
  setupStaticFiles(app)
  setupSwagger(app)
  setupMiddlewares(app)
  await setupRoutes(app)

  return app
}
