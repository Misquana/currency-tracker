import { db } from './db.js'

const insertStmt = db.prepare(`
  INSERT INTO rates (currency_code, currency_name, value, rate_date)
  VALUES (?, ?, ?, ?)
`)

/**
 * Сохраняет массив курсов валют в базу данных в рамках одной транзакции.
 *
 * @param {Array<{code: string, name: string, value: number, date: string}>} rates — массив объектов курсов
 * @returns {void}
 */
export function saveRates(rates) {
  const insertMany = db.transaction((items) => {
    for (const rate of items) {
      insertStmt.run(rate.code, rate.name, rate.value, rate.date)
    }
  })
  insertMany(rates)
}

const latestStmt = db.prepare(`
  SELECT currency_code, currency_name, value, rate_date, fetched_at
  FROM rates
  WHERE currency_code = ?
  ORDER BY rate_date DESC, id DESC
  LIMIT 1
`)

/**
 * Возвращает последний сохранённый курс по коду валюты.
 *
 * @param {string} currencyCode — код валюты в верхнем регистре, например 'USD'
 * @returns {{currency_code: string, currency_name: string, value: number, rate_date: string, fetched_at: string} | undefined}
 */
export function getLatestRate(currencyCode) {
  return latestStmt.get(currencyCode)
}

const historyStmt = db.prepare(`
  SELECT currency_code, currency_name, value, rate_date, fetched_at
  FROM rates
  WHERE currency_code = ?
  ORDER BY rate_date DESC, id DESC
  LIMIT ?
`)

/**
 * Возвращает историю курсов валюты за последние N записей.
 *
 * @param {string} currencyCode — код валюты в верхнем регистре, например 'USD'
 * @param {number} limit — максимальное количество записей в истории
 * @returns {Array<{currency_code: string, currency_name: string, value: number, rate_date: string, fetched_at: string}>}
 */
export function getRateHistory(currencyCode, limit) {
  return historyStmt.all(currencyCode, limit)
}

/**
 * Возвращает последний известный курс для каждой валюты в базе данных.
 *
 * @returns {Array<{currency_code: string, currency_name: string, value: number, rate_date: string, max_date: string}>}
 */
export function getAllLatestRates() {
  const allLatestStmt = db.prepare(`
  SELECT currency_code, currency_name, value, rate_date, MAX(rate_date) AS max_date
  FROM rates
  GROUP BY currency_code
  ORDER BY currency_code
`)

  return allLatestStmt.all()
}
