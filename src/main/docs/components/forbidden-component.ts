export const forbiddenComponent = {
  description: 'Denied access',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
