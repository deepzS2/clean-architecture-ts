import { CheckSurveyById, LoadSurveyResult } from '@/domain/usecases'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly _loadSurveyById: CheckSurveyById, private readonly _loadSurveyResult: LoadSurveyResult) {}

  async handle (request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, accountId } = request

      const surveyExists = await this._loadSurveyById.checkById(surveyId)

      if (!surveyExists) return forbidden(new InvalidParamError('surveyId'))

      const surveyResult = await this._loadSurveyResult.load(surveyId, accountId)

      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadSurveyResultController {
  export interface Request {
    surveyId: string
    accountId: string
  }
}
