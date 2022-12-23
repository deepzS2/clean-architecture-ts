import { makeDbLoadSurveyResult, makeDbLoadSurveyById, makeLogControllerDecorator } from '@/main/factories'
import { LoadSurveyResultController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResult())

  return makeLogControllerDecorator(controller)
}
