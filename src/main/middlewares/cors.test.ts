import { it, describe, beforeAll } from 'vitest'
import request from 'supertest'
import { Express } from 'express'
import { setupApp } from '../config/app'

let app: Express

describe('CORS Middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  it('Should enable CORS', async () => {
    app.get('/test_cors', (req, res) => {
      res.send()
    })

    await request(app).get('/test_cors').expect('access-control-allow-origin', '*').expect('access-control-allow-methods', '*').expect('access-control-allow-headers', '*')
  })
})
