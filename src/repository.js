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

  const upsertCurrenciesStmt = db.prepare(`
    INSERT INTO currencies (code, name) 
    VALUES (?, ?) 
    ON CONFLICT(code) DO UPDATE SET name = excluded.name
  `)

  const listNotesStmt = db.prepare(`
    SELECT id, text, currency_code, name AS currency_name 
    FROM notes 
    LEFT JOIN currencies ON currency_code = code
  `)

  const listNotesByCurrencyStmt = db.prepare(`
    SELECT id, text, currency_code, name AS currency_name 
    FROM notes 
    LEFT JOIN currencies ON currency_code = code
    WHERE currency_code = ?
  `)

  const getNoteByIdStmt = db.prepare(`
    SELECT id, text, currency_code 
    FROM notes 
    WHERE id = ?
  `)

  const createNoteStmt = db.prepare(`
    INSERT INTO notes (currency_code, text) 
    VALUES (?, ?)
  `)

  const updateNoteStmt = db.prepare(`
    UPDATE notes 
    SET text = ? 
    WHERE id = ?
  `)

  const deleteNoteStmt = db.prepare(`
    DELETE FROM notes 
    WHERE id = ?
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

  function upsertCurrencies(items) {
    const upsertMany = db.transaction((currencies) => {
      for (const item of currencies) {
        upsertCurrenciesStmt.run(item.code, item.name)
      }
    })
    upsertMany(items)
  }

  function listNotes({ currencyCode } = {}) {
    if (currencyCode) {
      return listNotesByCurrencyStmt.all(currencyCode)
    }
    return listNotesStmt.all()
  }

  function getNoteById(id) {
    return getNoteByIdStmt.get(id)
  }

  function createNote({ currencyCode, text }) {
    const result = createNoteStmt.run(currencyCode, text)
    return { id: result.lastInsertRowid, currencyCode, text,
    }
  }

  function updateNote(id, { text }) {
    updateNoteStmt.run(text, id)
    return { id, text }
  }

  function deleteNote(id) {
    deleteNoteStmt.run(id)
    return { id }
  }

  return { saveRates, getLatestRate, getRateHistory, getAllLatestRates, upsertCurrencies, listNotes, getNoteById, createNote, updateNote, deleteNote }
}

const defaultRepository = createRepository()
export const saveRates = defaultRepository.saveRates
export const getLatestRate = defaultRepository.getLatestRate
export const getRateHistory = defaultRepository.getRateHistory
export const getAllLatestRates = defaultRepository.getAllLatestRates
export const upsertCurrencies = defaultRepository.upsertCurrencies
export const listNotes = defaultRepository.listNotes
export const getNoteById = defaultRepository.getNoteById
export const createNote = defaultRepository.createNote
export const updateNote = defaultRepository.updateNote
export const deleteNote = defaultRepository.deleteNote
