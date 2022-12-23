import { ForbiddenError } from 'apollo-server-express'
import { GraphQLSchema } from 'graphql'

import { makeAuthMiddleware } from '@/main/factories'
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'

export function authDirectiveTransformer (schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: fieldConfig => {
      const authDirective = getDirective(schema, fieldConfig, 'auth')

      if (authDirective) {
        const { resolve } = fieldConfig
        const authMiddleware = makeAuthMiddleware()

        return {
          ...fieldConfig,
          resolve: async function (source, args, context, info) {
            const request = {
              accessToken: context?.req?.headers?.['x-access-token']
            }

            const httpResponse = await authMiddleware.handle(request)

            if (httpResponse.statusCode === 200) {
              Object.assign(context?.req, httpResponse.body)
              await resolve?.(source, args, context, info)
            } else {
              throw new ForbiddenError(httpResponse.body.message)
            }
          }
        }
      }
    }
  })
}
