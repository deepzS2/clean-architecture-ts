import { ok, serverError } from '@/presentation/helpers/http/http-helper'

import { HttpRequest, HttpResponse } from '../../authentication/login/login-controller-protocols'
import { Controller, LoadSurveyById } from './load-survey-result-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly _loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params

      await this._loadSurveyById.loadById(surveyId)

      return ok(null)
    } catch (error) {
      return serverError(error)
    }
  }
}
