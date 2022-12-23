import { LoadSurveys } from '@/domain/usecases'
import { noContent, ok, serverError } from '@/presentation/helpers'
import { HttpRequest, HttpResponse, Controller } from '@/presentation/protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly _loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this._loadSurveys.load(httpRequest.accountId as string)

      if (!surveys.length) return noContent()

      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
