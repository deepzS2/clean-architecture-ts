import { SurveyResultModel } from '../models/survey-result'

export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>

export interface AddSurvey {
  add: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
