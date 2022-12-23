import { AddSurvey } from '@/domain/usecases'
import { badRequest, serverError, noContent } from '@/presentation/helpers'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'

export class AddSurveyController implements Controller {
  constructor (private readonly _validation: Validation, private readonly _addSurvey: AddSurvey) {}

  async handle (request: AddSurveyController.Request): Promise<HttpResponse> {
    try {
      const error = this._validation.validate(request)

      if (error) {
        return badRequest(error)
      }

      const { question, answers } = request

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

export namespace AddSurveyController {
  export interface Request {
    question: string
    answers: Answer[]
  }

  interface Answer {
    image?: string
    answer: string
  }
}
