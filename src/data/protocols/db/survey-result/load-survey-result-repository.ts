import { SurveyResultModel } from "@/domain/models";

export interface LoadSurveyResultRepository {
  loadBySurveyId(surveyId: string, accountId: string): Promise<SurveyResultModel | null>
}

export namespace LoadSurveyResultRepository {
  export type Result = SurveyResultModel | null
}