import { LoadSurveys } from '@/domain/usecases'
import { noContent, ok, serverError } from '@/presentation/helpers'
import { HttpResponse, Controller } from '@/presentation/protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly _loadSurveys: LoadSurveys) {}

  async handle (request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const surveys = await this._loadSurveys.load(request.accountId)

      if (!surveys.length) return noContent()

      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadSurveysController {
  export interface Request {
    accountId: string
  }
}
