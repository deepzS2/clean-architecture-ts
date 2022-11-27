import { ok } from '../../../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../add-survey/add-survey-protocols'
import { Controller, LoadSurveys } from './load-surveys-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly _loadSurveys: LoadSurveys) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this._loadSurveys.load()

    return ok({})
  }
}
