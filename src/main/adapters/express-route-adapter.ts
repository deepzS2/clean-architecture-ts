import { Request, RequestHandler, Response } from 'express'

import { Controller } from '@/presentation/protocols'

export const adaptRoute = (controller: Controller): RequestHandler => {
  return async (req: Request, res: Response) => {
    const request = {
      ...(req.body ?? {}),
      ...(req.params ?? {}),
      accountId: req.accountId
    }

    const httpResponse = await controller.handle(request)

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      return res.status(httpResponse.statusCode).send(httpResponse.body)
    } else {
      console.log(httpResponse)
      res.status(httpResponse.statusCode).send({ error: httpResponse.body.message })
    }
  }
}
