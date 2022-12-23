import { DbSaveSurveyResult } from '@/data/usecases'
import { SurveyResultMongoRepository } from '@/infra/database'

export const makeDbSaveSurveyResult = (): DbSaveSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()

  return new DbSaveSurveyResult(surveyResultMongoRepository, surveyResultMongoRepository)
}
