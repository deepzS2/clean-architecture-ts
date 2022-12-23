import { DbLoadSurveyResult } from '@/data/usecases'
import { SurveyResultMongoRepository, SurveyMongoRepository } from '@/infra/database'

export const makeDbLoadSurveyResult = (): DbLoadSurveyResult => {
  const surveyMongoRepository = new SurveyMongoRepository()
  const surveyResultMongoRepository = new SurveyResultMongoRepository()

  return new DbLoadSurveyResult(surveyResultMongoRepository, surveyMongoRepository)
}
