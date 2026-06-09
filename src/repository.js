import { db as defaultDb } from './db.js'

export function createRepository(db = defaultDb) {
  const insertStmt = db.prepare(`
    INSERT INTO rates (currency_code, currency_name, value, rate_date)
    VALUES (?, ?, ?, ?)
  `)

  const latestStmt = db.prepare(`
    SELECT currency_code, currency_name, value, rate_date, fetched_at
    FROM rates
    WHERE currency_code = ?
    ORDER BY rate_date DESC, id DESC
    LIMIT 1
  `)

  const historyStmt = db.prepare(`
    SELECT currency_code, currency_name, value, rate_date, fetched_at
    FROM rates
    WHERE currency_code = ?
    ORDER BY rate_date DESC, id DESC
    LIMIT ?
  `)

  const allLatestStmt = db.prepare(`
    SELECT currency_code, currency_name, value, MAX(rate_date) AS rate_date
    FROM rates
    GROUP BY currency_code
    ORDER BY currency_code
  `)

  function saveRates(rates) {
    const insertMany = db.transaction((items) => {
      for (const rate of items) {
        insertStmt.run(rate.code, rate.name, rate.value, rate.date)
      }
    })
    insertMany(rates)
  }

  function getLatestRate(currencyCode) {
    return latestStmt.get(currencyCode)
  }

  function getRateHistory(currencyCode, limit) {
    return historyStmt.all(currencyCode, limit)
  }

  function getAllLatestRates() {
    return allLatestStmt.all()
  }

  return { saveRates, getLatestRate, getRateHistory, getAllLatestRates }
}

const defaultRepository = createRepository()
export const saveRates = defaultRepository.saveRates
export const getLatestRate = defaultRepository.getLatestRate
export const getRateHistory = defaultRepository.getRateHistory
export const getAllLatestRates = defaultRepository.getAllLatestRates
