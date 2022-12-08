export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'API to authenticate user',
    requestBody: {
      description: 'Success',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/login-params'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account'
            }
          }
        }
      }
    }
  }
}
