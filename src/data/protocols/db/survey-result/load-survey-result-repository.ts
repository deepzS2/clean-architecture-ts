import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResultParams } from "@/domain/usecases/survey-result/save-survey-result";

export interface LoadSurveyResultRepository {
  loadBySurveyId(surveyId: string): Promise<SurveyResultModel | null>
}