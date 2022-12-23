import { NextFunction, Request, RequestHandler, Response } from 'express'

import { Middleware } from '@/presentation/protocols'

export const adaptMiddleware = (middleware: Middleware): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request = {
      ...(req.headers ?? {}),
      accessToken: req.headers?.['x-access-token']
    }

    const httpResponse = await middleware.handle(request)

    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body)
      next()
    } else {
      res.status(httpResponse.statusCode).send({ error: httpResponse.body.message })
    }
  }
}
