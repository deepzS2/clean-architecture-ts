import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor (private readonly _controller: Controller, private readonly _logErrorRepository: LogErrorRepository) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this._controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      await this._logErrorRepository.log(httpResponse.body.stack)
    }

    return httpResponse
  }
}
