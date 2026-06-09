import { describe, it, expect } from 'vitest'
import { formatRates } from './formatter.js'

describe('formatRates', () => {
  it('преобразует raw-ответ в массив объектов', () => {
    const raw = {
      Date: '2025-05-17T11:30:00+03:00',
      Valute: {
        USD: {
          CharCode: 'USD',
          Nominal: 1,
          Name: 'Доллар США',
          Value: 80.5432,
        },
      },
    }

    const result = formatRates(raw)

    expect(result).toEqual([
      {
        code: 'USD',
        name: 'Доллар США',
        value: 80.5432,
        date: '2025-05-17T11:30:00+03:00',
      },
    ])
  })

  it('делит value на nominal для валют с nominal > 1', () => {
    const raw = {
      Date: '2025-05-17T11:30:00+03:00',
      Valute: {
        JPY: {
          CharCode: 'JPY',
          Nominal: 100,
          Name: 'Иена',
          Value: 52.5,
        },
      },
    }

    const result = formatRates(raw)

    expect(result[0].value).toBe(0.525)
  })

  it('округляет до 4 знаков после запятой', () => {
    const raw = {
      Date: '2025-05-17T11:30:00+03:00',
      Valute: {
        USD: {
          CharCode: 'USD',
          Nominal: 1,
          Name: 'Доллар США',
          Value: 80.12345678,
        },
      },
    }

    const result = formatRates(raw)

    expect(result[0].value).toBe(80.1235)
  })

  it('бросает ошибку, если Valute отсутствует', () => {
    const raw = { Date: '2025-05-17T11:30:00+03:00' }

    expect(() => formatRates(raw)).toThrow(/Valute/)
  })
})
