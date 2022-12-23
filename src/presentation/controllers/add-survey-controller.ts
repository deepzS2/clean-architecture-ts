import { AddSurvey } from '@/domain/usecases'
import { badRequest, serverError, noContent } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/protocols'

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
        question,
        date: new Date()
      })

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
