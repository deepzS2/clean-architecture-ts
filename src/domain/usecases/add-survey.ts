import { SurveyModel } from '../models/survey'

export type AddSurveyParams = Omit<SurveyModel, 'id'>

export interface AddSurvey {
  add: (data: AddSurvey.Params) => Promise<void>
}

export namespace AddSurvey {
  export type Params = Omit<SurveyModel, 'id'>
}
