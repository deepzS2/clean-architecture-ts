import { mockSurveyResultModel } from '@/domain/mocks'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  surveyResultModel: SurveyResultModel | null = mockSurveyResultModel()
  saveSurveyResultParams: SaveSurveyResultParams

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel | null> {
    this.saveSurveyResultParams = data

    return await Promise.resolve(this.surveyResultModel)
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyResultModel: SurveyResultModel | null = mockSurveyResultModel()
  surveyId: string

  async load (surveyId: string): Promise<SurveyResultModel | null> {
    this.surveyId = surveyId

    return await Promise.resolve(this.surveyResultModel)
  }
}
