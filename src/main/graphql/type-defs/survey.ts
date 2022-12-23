import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    surveys: [Survey!]! @auth
  }

  type Survey {
    id: ID!
    answers: [SurveyAnswerModel!]!
    question: String!
    date: DateTime!
    didAnswers: Boolean
  }

  type SurveyAnswerModel {
    image: String
    answer: String!
  }
`
