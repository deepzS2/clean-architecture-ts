import { AddSurveyRepository } from '@/data/protocols'
import { AddSurvey, AddSurveyParams } from '@/domain/usecases'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly _addSurveyRepository: AddSurveyRepository) {}

  async add (data: AddSurveyParams): Promise<void> {
    return await this._addSurveyRepository.add(data)
  }
}
