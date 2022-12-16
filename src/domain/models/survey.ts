export interface SurveyModel {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  date: Date
}

interface SurveyAnswerModel {
  image?: string
  answer: string
}
