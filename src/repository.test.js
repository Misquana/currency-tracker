import { describe, it, expect, beforeEach } from 'vitest'
import { createDatabase } from './db.js'
import { createRepository } from './repository.js'

describe('repository', () => {
  let repo
  let db

  beforeEach(() => {
    db = createDatabase(':memory:')
    db.pragma('foreign_keys', { simple: true })
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

  it('upsertCurrencies корректно создает новые и обновляет существующие валюты', () => {
    repo.upsertCurrencies([
      { code: 'USD', name: 'Доллар США' },
    ])
    repo.upsertCurrencies([
      { code: 'USD', name: 'Американский Доллар' },
    ])
    repo.saveRates([{ code: 'USD', name: 'Американский Доллар', value: 80, date: '2025-05-17T00:00:00+03:00' }])
    const latest = repo.getLatestRate('USD')
    expect(latest).toMatchObject({
      currency_code: 'USD',
      currency_name: 'Американский Доллар',
    })
  })

  it('выполняет полный цикл CRUD для заметок', () => {
    repo.upsertCurrencies([{ code: 'CAD', name: 'Канадский доллар' }])

    const created = repo.createNote({ currencyCode: 'CAD', text: 'Заметка для CAD' })
    expect(created).toMatchObject({
      id: expect.any(Number),
      currencyCode: 'CAD',
      text: 'Заметка для CAD',
    })

    const fetched = repo.getNoteById(created.id)
    expect(fetched).toMatchObject({ text: 'Заметка для CAD' })

    const list = repo.listNotes({ currencyCode: 'CAD' })
    expect(list).toHaveLength(1)
    expect(list[0].id).toBe(created.id)

    const updated = repo.updateNote(created.id, { text: 'Новый текст' })
    expect(updated).toMatchObject({ id: created.id, text: 'Новый текст' })
    expect(repo.getNoteById(created.id).text).toBe('Новый текст')

    const deleted = repo.deleteNote(created.id)
    expect(deleted.id).toBe(created.id)
    expect(repo.getNoteById(created.id)).toBeUndefined()
  })

  it('выбрасывает ошибку при попытке создать заметку для несуществующей валюты', () => {
    expect(() => {
      repo.createNote({ currencyCode: 'FAKE', text: 'Не сработаетт' })
    }).toThrow()
  })

  it('автоматически удаляет заметку каскадом при удалении валюты', () => {
    repo.upsertCurrencies([{ code: 'JPY', name: 'Японская иена' }])
    const note = repo.createNote({ currencyCode: 'JPY', text: 'Заметка для иены' })
    expect(repo.getNoteById(note.id)).toBeDefined()
    db.prepare('DELETE FROM currencies WHERE code = ?').run('JPY')
    expect(repo.getNoteById(note.id)).toBeUndefined()
  })
})
