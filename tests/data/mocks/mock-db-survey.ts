import { AddSurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository, CheckSurveyByIdRepository, LoadAnswersBySurveyRepository } from '@/data/protocols'
import { SurveyModel } from '@/domain/models/survey'
import { faker } from '@faker-js/faker'

import { mockSurveyModel, mockSurveyModels } from '../../domain/mocks'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyParams: AddSurveyRepository.Params

  async add (data: AddSurveyRepository.Params): Promise<void> {
    this.addSurveyParams = data

    return await Promise.resolve()
  }
}
export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  result: LoadSurveyByIdRepository.Result = mockSurveyModel()
  id: string

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    this.id = id

    return await Promise.resolve(this.result)
  }
}

export class LoadAnswersBySurveyRepositorySpy implements LoadAnswersBySurveyRepository {
  result: LoadAnswersBySurveyRepository.Result = [faker.random.word(), faker.random.word()]
  id: string

  async loadAnswers (id: string): Promise<LoadAnswersBySurveyRepository.Result> {
    this.id = id

    return await Promise.resolve(this.result)
  }
}

export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
  result: CheckSurveyByIdRepository.Result = true
  id: string

  async checkById (id: string): Promise<CheckSurveyByIdRepository.Result> {
    this.id = id

    return await Promise.resolve(this.result)
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
