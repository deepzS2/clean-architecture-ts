import { SurveyModel } from '@/domain/models'
import { AddSurvey, AddSurveyParams, LoadSurveyById, LoadSurveys } from '@/domain/usecases'

import { mockSurveyModel, mockSurveyModels } from '../../domain/mocks'

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurveyParams

  async add (data: AddSurveyParams): Promise<void> {
    this.addSurveyParams = data

    return await Promise.resolve()
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  surveyModels = mockSurveyModels()
  accountId: string

  async load (accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId

    return await Promise.resolve(this.surveyModels)
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  surveyModel: SurveyModel | null = mockSurveyModel()
  id: string

  async loadById (id: string): Promise<SurveyModel | null> {
    this.id = id

    return await Promise.resolve(this.surveyModel)
  }
}
