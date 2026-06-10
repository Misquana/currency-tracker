import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { createApp } from '../app.js'
import { saveRates } from '../../repository.js'

const app = createApp()

describe('GET /api/rates/:code', () => {
  beforeAll(() => {
    saveRates([
      { code: 'USD', name: 'Доллар США', value: 80, date: '2025-05-17T00:00:00+03:00' },
    ])
  })

  it('возвращает 200 и курс по существующей валюте', async () => {
    const response = await request(app).get('/api/rates/USD')

    expect(response.status).toBe(200)
    expect(response.body.data).toMatchObject({
      currency_code: 'USD',
      value: 73.3436,
    })
  })

  it('возвращает 200 при коде валюты в нижнем регистре', async () => {
    const response = await request(app).get('/api/rates/usd')
    expect(response.status).toBe(200)
  })

  it('возвращает 404 для несуществующей валюты', async () => {
    const response = await request(app).get('/api/rates/XXX')

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Not Found')
  })

  it('возвращает 400 при невалидном days', async () => {
    const response = await request(app).get('/api/rates/USD/history?days=abc')

    expect(response.status).toBe(400)
  })
})
