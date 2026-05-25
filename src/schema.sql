CREATE TABLE IF NOT EXISTS rates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  currency_code TEXT NOT NULL,
  currency_name TEXT NOT NULL,
  value REAL NOT NULL,
  rate_date TEXT NOT NULL,
  fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_rates_currency_code ON rates(currency_code);
CREATE INDEX IF NOT EXISTS idx_rates_rate_date ON rates(rate_date);