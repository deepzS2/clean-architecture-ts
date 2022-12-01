import { LoadSurveyById, LoadSurveyByIdRepository, SurveyModel } from './db-load-survey-by-id-protocols'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly _loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  async loadById (id: string): Promise<SurveyModel | null> {
    const survey = await this._loadSurveyByIdRepository.loadById(id)

    return survey
  }
}
