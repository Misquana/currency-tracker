CREATE TABLE IF NOT EXISTS rates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  currency_code TEXT NOT NULL,
  currency_name TEXT NOT NULL,
  value REAL NOT NULL,
  rate_date TEXT NOT NULL,
  fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS currencies (
  code TEXT PRIMARY KEY CHECK (LENGTH(code) = 3),
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  currency_code TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (currency_code) REFERENCES currencies(code) ON DELETE CASCADE
);


CREATE INDEX IF NOT EXISTS idx_rates_currency_code ON rates(currency_code);
CREATE INDEX IF NOT EXISTS idx_rates_rate_date ON rates(rate_date);
CREATE INDEX IF NOT EXISTS idx_notes_currency_code ON notes(currency_code);


