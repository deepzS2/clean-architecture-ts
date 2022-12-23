import { LoadAnswersBySurvey, SaveSurveyResult } from '@/domain/usecases'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { HttpResponse, Controller } from '@/presentation/protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly _loadAnswersBySurvey: LoadAnswersBySurvey, private readonly _saveSurveyResult: SaveSurveyResult) {}

  async handle (request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, answer, accountId } = request

      const answers = await this._loadAnswersBySurvey.loadAnswers(surveyId)

      if (!answers?.length) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const isAnswerNotListed = !answers.includes(answer)

      if (isAnswerNotListed) {
        return forbidden(new InvalidParamError('answer'))
      }

      const surveyResult = await this._saveSurveyResult.save({
        surveyId,
        answer,
        accountId,
        date: new Date()
      })

      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SaveSurveyResultController {
  export interface Request {
    surveyId: string
    accountId: string
    answer: string
  }
}
