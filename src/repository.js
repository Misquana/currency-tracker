import { db } from './db.js'

const insertStmt = db.prepare(`
  INSERT INTO rates (currency_code, currency_name, value, rate_date)
  VALUES (?, ?, ?, ?)
`)

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

export function getLatestRate(currencyCode) {
  return latestStmt.get(currencyCode)
}

export function getRateHistory(currencyCode, limit) {
  const historyStmt = db.prepare(`
  SELECT currency_code, currency_name, value, rate_date, fetched_at
  FROM rates
  WHERE currency_code = ?
  ORDER BY rate_date DESC, id DESC
`)

  return historyStmt.all(currencyCode, limit)
}

export function getAllLatestRates() {
  const allLatestStmt = db.prepare(`
  SELECT currency_code, currency_name, value, rate_date, MAX(rate_date) AS max_date
  FROM rates
  GROUP BY currency_code
  ORDER BY currency_code
`)

  return allLatestStmt.all()
}
