import { describe, it, expect, beforeEach } from 'vitest'
import { createDatabase } from './db.js'
import { createRepository } from './repository.js'

describe('repository', () => {
  let repo

  beforeEach(() => {
    const db = createDatabase(':memory:')
    repo = createRepository(db)
  })

  it('сохраняет курсы и возвращает последний', () => {
    repo.saveRates([
      { code: 'USD', name: 'Доллар США', value: 80, date: '2025-05-17T00:00:00+03:00' },
    ])

    const latest = repo.getLatestRate('USD')

    expect(latest).toMatchObject({
      currency_code: 'USD',
      currency_name: 'Доллар США',
      value: 80,
    })
  })

  it('возвращает undefined для несуществующей валюты', () => {
    expect(repo.getLatestRate('XXX')).toBeUndefined()
  })

  it('getRateHistory возвращает массив, ограниченный limit', () => {
    const rates = []
    for (let i = 0; i < 5; i++) {
      rates.push({
        code: 'USD',
        name: 'Доллар США',
        value: 80 + i,
        date: `2025-05-1${i}T00:00:00+03:00`,
      })
    }
    repo.saveRates(rates)

    const history = repo.getRateHistory('USD', 3)

    expect(history).toHaveLength(3)
  })

  it('getAllLatestRates возвращает по одной записи на валюту', () => {
    repo.saveRates([
      { code: 'USD', name: 'Доллар США', value: 80, date: '2025-05-17T00:00:00+03:00' },
      { code: 'USD', name: 'Доллар США', value: 81, date: '2025-05-18T00:00:00+03:00' },
      { code: 'EUR', name: 'Евро', value: 90, date: '2025-05-18T00:00:00+03:00' },
    ])

    const all = repo.getAllLatestRates()

    expect(all).toHaveLength(2)
    const usd = all.find(r => r.currency_code === 'USD')
    expect(usd.value).toBe(81)
  })
})
