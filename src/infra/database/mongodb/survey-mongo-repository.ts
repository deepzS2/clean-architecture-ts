import { ObjectId } from 'mongodb'

import { LoadSurveysRepository, LoadSurveyByIdRepository, AddSurveyRepository } from '@/data/protocols'
import { SurveyModel } from '@/domain/models'

import { MongoHelper, QueryBuilder } from '.'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (data: AddSurveyRepository.Params): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')

    await surveyCollection.insertOne(data)
  }

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection<SurveyModel>('surveys')

    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result'
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [{
            $size: {
              $filter: {
                input: '$result',
                as: 'item',
                cond: {
                  $eq: ['$$item.accountId', new ObjectId(accountId)]
                }
              }
            }
          }, 1]
        }
      })
      .build()

    const surveys = await surveyCollection.aggregate(query).toArray()

    return MongoHelper.mapCollection<SurveyModel>(surveys)
  }

  async loadById (id: string): Promise<LoadSurveyByIdRepository.Result> {
    const surveyCollection = await MongoHelper.getCollection<SurveyModel>('surveys')

    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })

    return survey && MongoHelper.map<SurveyModel>(survey._id, survey)
  }
}
