import { LoadSurveyByIdRepository } from '@/data/protocols'
import { SurveyModel } from '@/domain/models'
import { LoadSurveyById } from '@/domain/usecases'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly _loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  async loadById (id: string): Promise<SurveyModel | null> {
    const survey = await this._loadSurveyByIdRepository.loadById(id)

    return survey
  }
}
