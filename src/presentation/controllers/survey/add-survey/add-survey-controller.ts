import { Controller, HttpRequest, HttpResponse, Validation, AddSurvey } from './add-survey-protocols'
import { badRequest, serverError, noContent } from '../../../helpers/http/http-helper'

export class AddSurveyController implements Controller {
  constructor (private readonly _validation: Validation, private readonly _addSurvey: AddSurvey) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this._validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { question, answers } = httpRequest.body

      await this._addSurvey.add({
        answers,
        question
      })

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
