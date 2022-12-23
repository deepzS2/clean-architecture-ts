import { LoadSurveysRepository } from '@/data/protocols'
import { LoadSurveys } from '@/domain/usecases'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly _loadSurveysRepository: LoadSurveysRepository) {}

  async load (accountId: string): Promise<LoadSurveys.Result> {
    const surveys = await this._loadSurveysRepository.loadAll(accountId)

    return surveys
  }
}
