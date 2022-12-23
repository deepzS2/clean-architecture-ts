import { SurveyResultModel } from '../../models/survey-result'

export interface SaveSurveyResultParams {
  surveyId: string
  accountId: string
  answer: string
  date: Date
}

export interface SaveSurveyResult {
  save: (data: SaveSurveyResultParams) => Promise<SurveyResultModel | null>
}
