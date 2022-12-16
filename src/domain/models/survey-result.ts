export interface SurveyResultModel {
  surveyId: string
  question: string
  answers: SurveyResultAnswerModel[]
  date: Date
}
interface SurveyResultAnswerModel {
  image?: string
  answer: string
  count: number
  percent: number
}
