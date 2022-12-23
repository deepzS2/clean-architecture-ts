import { Express } from 'express'
import request from 'supertest'
import { it, describe, beforeAll } from 'vitest'

import { setupApp } from '@/main/config/app'

let app: Express

describe('Content Type Middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  it('Should return default content type as json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send()
    })

    await request(app).get('/test_content_type').expect('content-type', /json/)
  })

  it('Should return xml content type when forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app).get('/test_content_type_xml').expect('content-type', /xml/)
  })
})
