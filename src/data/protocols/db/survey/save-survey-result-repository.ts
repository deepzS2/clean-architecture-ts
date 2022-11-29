import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResultModel } from "@/domain/usecases/save-survey-result";

export interface SaveSurveyResultRepository {
  save(surveyData: SaveSurveyResultModel): Promise<SurveyResultModel>
}