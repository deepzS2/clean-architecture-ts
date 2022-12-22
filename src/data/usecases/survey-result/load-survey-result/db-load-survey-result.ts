import { LoadSurveyByIdRepository, LoadSurveyResult, LoadSurveyResultRepository, SurveyResultModel } from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (private readonly _loadSurveyResultRepository: LoadSurveyResultRepository, private readonly _loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  async load (surveyId: string): Promise<SurveyResultModel | null> {
    const surveyResult = await this._loadSurveyResultRepository.loadBySurveyId(surveyId)

    if (!surveyResult) {
      await this._loadSurveyByIdRepository.loadById(surveyId)
    }

    return surveyResult
  }
}
