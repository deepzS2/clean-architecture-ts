import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'

import { HttpRequest, HttpResponse } from '../../authentication/login/login-controller-protocols'
import { Controller, LoadSurveyById } from './save-survey-result-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly _loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body

      const survey = await this._loadSurveyById.loadById(surveyId)

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const answers = survey.answers.map(a => a.answer)
      const isAnswerNotListed = !answers.includes(answer)

      if (isAnswerNotListed) {
        return forbidden(new InvalidParamError('answer'))
      }

      return ok({})
    } catch (error) {
      return serverError(error)
    }
  }
}
