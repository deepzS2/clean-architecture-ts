import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

import { mockSurveyModel, mockSurveyModels } from '../../domain/mocks'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyParams: AddSurveyParams

  async add (data: AddSurveyParams): Promise<void> {
    this.addSurveyParams = data

    return await Promise.resolve()
  }
}
export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  surveyModel: SurveyModel | null = mockSurveyModel()
  id: string

  async loadById (id: string): Promise<SurveyModel | null> {
    this.id = id

    return await Promise.resolve(this.surveyModel)
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  surveyModels = mockSurveyModels()
  accountId: string

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId

    return await Promise.resolve(this.surveyModels)
  }
}
