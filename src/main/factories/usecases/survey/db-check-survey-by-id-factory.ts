import { DbCheckSurveyById } from '@/data/usecases'
import { SurveyMongoRepository } from '@/infra/database'

export const makeDbCheckSurveyById = (): DbCheckSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()

  return new DbCheckSurveyById(surveyMongoRepository)
}
