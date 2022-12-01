import { DbLoadSurveys } from '@/data/usecases/survey/load-surveys/db-load-surveys'
import { SurveyMongoRepository } from '@/infra/database/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveys = (): DbLoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository()

  return new DbLoadSurveys(surveyMongoRepository)
}
