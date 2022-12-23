import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { SurveyMongoRepository } from '@/infra/database'

export const makeDbLoadAnswersBySurvey = (): DbLoadAnswersBySurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()

  return new DbLoadAnswersBySurvey(surveyMongoRepository)
}
