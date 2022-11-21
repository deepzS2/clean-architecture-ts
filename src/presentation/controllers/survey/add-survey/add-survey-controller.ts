import { Controller, HttpRequest, HttpResponse, Validation } from './add-survey-protocols'
import { ok } from '../../../helpers/http/http-helper'

export class AddSurveyController implements Controller {
  constructor (private readonly _validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this._validation.validate(httpRequest.body)

    return ok({})
  }
}
