import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'

import { HttpRequest, HttpResponse } from '../../authentication/login/login-controller-protocols'
import { Controller, LoadSurveyById, LoadSurveyResult } from './load-survey-result-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly _loadSurveyById: LoadSurveyById, private readonly _loadSurveyResult: LoadSurveyResult) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params

      const survey = await this._loadSurveyById.loadById(surveyId)

      if (!survey) return forbidden(new InvalidParamError('surveyId'))

      const surveyResult = await this._loadSurveyResult.load(surveyId)

      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
