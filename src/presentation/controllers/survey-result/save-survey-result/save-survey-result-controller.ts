import { ok } from '@/presentation/helpers/http/http-helper'

import { HttpRequest, HttpResponse } from '../../authentication/login/login-controller-protocols'
import { Controller, LoadSurveyById } from './save-survey-result-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly _loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this._loadSurveyById.loadById(httpRequest.params.surveyId)

    return ok({})
  }
}
