import { it, describe, beforeAll } from 'vitest'
import request from 'supertest'
import { setupApp } from '../config/app'
import { Express } from 'express'

let app: Express

describe('Body Parser Middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  it('Should parse body as json', async () => {
    app.post('/test-body_parser', (req, res) => {
      res.send(req.body)
    })

    await request(app).post('/test-body_parser').send({ name: 'Alan' }).expect({ name: 'Alan' })
  })
})
