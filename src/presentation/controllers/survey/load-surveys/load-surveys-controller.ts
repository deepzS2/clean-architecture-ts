import { noContent, ok, serverError } from '../../../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../add-survey/add-survey-protocols'
import { Controller, LoadSurveys } from './load-surveys-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly _loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this._loadSurveys.load()

      if (!surveys.length) return noContent()

      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
