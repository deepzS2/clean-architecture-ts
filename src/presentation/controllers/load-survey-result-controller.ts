import { LoadSurveyById, LoadSurveyResult } from '@/domain/usecases'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly _loadSurveyById: LoadSurveyById, private readonly _loadSurveyResult: LoadSurveyResult) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params

      const survey = await this._loadSurveyById.loadById(surveyId)

      if (!survey) return forbidden(new InvalidParamError('surveyId'))

      const surveyResult = await this._loadSurveyResult.load(surveyId, httpRequest.accountId as string)

      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
