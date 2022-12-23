import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResultParams } from "@/domain/usecases";

export interface SaveSurveyResultRepository {
  save(surveyData: SaveSurveyResultParams): Promise<void>
}