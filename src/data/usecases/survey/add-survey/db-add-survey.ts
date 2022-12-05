import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

import { AddSurvey, AddSurveyRepository } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly _addSurveyRepository: AddSurveyRepository) {}

  async add (data: AddSurveyParams): Promise<void> {
    return await this._addSurveyRepository.add(data)
  }
}
