import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok } from '@/presentation/helpers/http/http-helper'

import { HttpRequest, HttpResponse } from '../../authentication/login/login-controller-protocols'
import { Controller, LoadSurveyById } from './save-survey-result-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly _loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const survey = await this._loadSurveyById.loadById(httpRequest.params.surveyId)

    if (!survey) {
      return forbidden(new InvalidParamError('surveyId'))
    }

    return ok({})
  }
}
