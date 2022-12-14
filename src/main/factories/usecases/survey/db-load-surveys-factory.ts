import { DbLoadSurveys } from '@/data/usecases'
import { SurveyMongoRepository } from '@/infra/database'

export const makeDbLoadSurveys = (): DbLoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()

  return new DbLoadSurveys(surveyMongoRepository)
}
