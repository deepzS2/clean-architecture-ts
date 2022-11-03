import { it, describe } from 'vitest'
import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
  it('Should parse body as json', async () => {
    app.post('/test-body_parser', (req, res) => {
      res.send(req.body)
    })

    await request(app).post('/test-body_parser').send({ name: 'Alan' }).expect({ name: 'Alan' })
  })
})
