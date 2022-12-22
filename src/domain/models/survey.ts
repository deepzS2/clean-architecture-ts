export interface SurveyModel {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  didAnswer?: boolean
  date: Date
}

interface SurveyAnswerModel {
  image?: string
  answer: string
}
