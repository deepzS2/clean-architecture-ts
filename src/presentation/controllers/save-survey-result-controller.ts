import { LoadSurveyById, SaveSurveyResult } from '@/domain/usecases'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { HttpRequest, HttpResponse, Controller } from '@/presentation/protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly _loadSurveyById: LoadSurveyById, private readonly _saveSurveyResult: SaveSurveyResult) {}

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

      const surveyResult = await this._saveSurveyResult.save({
        surveyId,
        answer,
        accountId: httpRequest.accountId as string,
        date: new Date()
      })

      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
