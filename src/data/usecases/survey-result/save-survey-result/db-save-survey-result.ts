import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result'

import { SaveSurveyResult, SaveSurveyResultRepository } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly _saveSurveyResultRepository: SaveSurveyResultRepository) {}

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const result = await this._saveSurveyResultRepository.save(data)

    return result
  }
}
