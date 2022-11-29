import { ObjectId } from 'mongodb'

import { AddSurveyModel, AddSurveyRepository } from '@/data/usecases/add-survey/db-add-survey-protocols'
import { LoadSurveyByIdRepository } from '@/data/usecases/load-survey-by-id/db-load-survey-by-id-protocols'
import { LoadSurveysRepository, SurveyModel } from '@/data/usecases/load-surveys/db-load-surveys-protocols'

import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')

    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection<SurveyModel>('surveys')

    const surveys = await surveyCollection.find().toArray()

    return surveys
  }

  async loadById (id: string): Promise<SurveyModel | null> {
    const surveyCollection = await MongoHelper.getCollection<SurveyModel>('surveys')

    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })

    return survey
  }
}
