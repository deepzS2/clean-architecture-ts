import { makeDbLoadAnswersBySurvey, makeDbSaveSurveyResult, makeLogControllerDecorator } from '@/main/factories'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbLoadAnswersBySurvey(), makeDbSaveSurveyResult())

  return makeLogControllerDecorator(controller)
}
