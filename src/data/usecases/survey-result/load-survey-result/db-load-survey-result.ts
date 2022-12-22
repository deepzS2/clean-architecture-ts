import { LoadSurveyByIdRepository, LoadSurveyResult, LoadSurveyResultRepository, SurveyResultModel } from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (private readonly _loadSurveyResultRepository: LoadSurveyResultRepository, private readonly _loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  async load (surveyId: string, accountId: string): Promise<SurveyResultModel | null> {
    let surveyResult = await this._loadSurveyResultRepository.loadBySurveyId(surveyId, accountId)

    if (!surveyResult) {
      const survey = await this._loadSurveyByIdRepository.loadById(surveyId)

      if (!survey) return null

      surveyResult = {
        surveyId: survey.id,
        question: survey.question,
        date: survey.date,
        answers: survey.answers.map(answer => ({ ...answer, count: 0, percent: 0, isCurrentAccountAnswer: false }))
      }
    }

    return surveyResult
  }
}
