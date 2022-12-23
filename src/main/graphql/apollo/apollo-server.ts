import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'
import { GraphQLError } from 'graphql'

import { authDirectiveTransformer } from '@/main/graphql/directives'
import resolvers from '@/main/graphql/resolvers'
import typeDefs from '@/main/graphql/type-defs'
import { makeExecutableSchema } from '@graphql-tools/schema'

const handleErrors = async (response: any, errors?: readonly GraphQLError[]): Promise<void> => {
  errors?.forEach(error => {
    if (checkError(error, 'UserInputError')) {
      response.http.status = 400
    }

    if (checkError(error, 'AuthenticationError')) {
      response.http.status = 401
    }

    if (checkError(error, 'ForbiddenError')) {
      response.http.status = 403
    }

    response.http.status = 500
  })
}

const checkError = (error: GraphQLError, errorName: string): boolean => {
  return [error.name, error.originalError?.name].some(name => name === errorName)
}

let schema = makeExecutableSchema({ resolvers, typeDefs })
schema = authDirectiveTransformer(schema)

export const setupApolloServer = (app: Express): ApolloServer => new ApolloServer({
  schema,
  context: ({ req }) => ({ req }),
  plugins: [{
    requestDidStart: async () => ({
      willSendResponse: async ({ response, errors }) => await handleErrors(response, errors)
    })
  }]
})
