import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResult, SaveSurveyResultParams, LoadSurveyResult } from '@/domain/usecases'

import { mockSurveyResultModel } from '../../domain/mocks'

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
  accountId: string

  async load (surveyId: string, accountId: string): Promise<SurveyResultModel | null> {
    this.surveyId = surveyId
    this.accountId = accountId

    return await Promise.resolve(this.surveyResultModel)
  }
}
