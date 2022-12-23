import { DbAddSurvey } from '@/data/usecases'
import { SurveyMongoRepository } from '@/infra/database'

export const makeDbAddSurvey = (): DbAddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()

  return new DbAddSurvey(surveyMongoRepository)
}
