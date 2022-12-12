import { badRequestComponent, forbiddenComponent, notFoundComponent, serverErrorComponent, unauthorizedComponent } from './components/'
import { apiKeyAuthSchema } from './schemas/'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest: badRequestComponent,
  unauthorized: unauthorizedComponent,
  serverError: serverErrorComponent,
  notFound: notFoundComponent,
  forbidden: forbiddenComponent
}
