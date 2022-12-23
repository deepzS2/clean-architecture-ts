import { LoadSurveyByIdRepository } from '@/data/protocols'
import { LoadSurveyById } from '@/domain/usecases'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly _loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  async loadById (id: string): Promise<LoadSurveyById.Result> {
    return await this._loadSurveyByIdRepository.loadById(id)
  }
}
