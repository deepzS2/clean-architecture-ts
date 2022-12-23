import { SaveSurveyResult, LoadSurveyResult } from '@/domain/usecases'

import { mockSurveyResultModel } from '../../domain/mocks'

export class SaveSurveyResultSpy implements SaveSurveyResult {
  result: SaveSurveyResult.Result = mockSurveyResultModel()
  saveSurveyResultParams: SaveSurveyResult.Params

  async save (data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    this.saveSurveyResultParams = data

    return await Promise.resolve(this.result)
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  result: LoadSurveyResult.Result = mockSurveyResultModel()
  surveyId: string
  accountId: string

  async load (surveyId: string, accountId: string): Promise<LoadSurveyResult.Result> {
    this.surveyId = surveyId
    this.accountId = accountId

    return await Promise.resolve(this.result)
  }
}
