import { Router } from 'express'
import {
  getAllLatestRates,
  getLatestRate,
  getRateHistory,
} from '../../repository.js'
import {
  DEFAULT_HISTORY_DAYS,
  MAX_HISTORY_DAYS,
} from '../../config.js'

export const ratesRouter = Router()

ratesRouter.get('/today', (req, res) => {
  const rates = getAllLatestRates()
  res.json({ data: rates })
})

ratesRouter.get('/:code', (req, res) => {
  const code = req.params.code.toUpperCase()
  const rate = getLatestRate(code)

  if (!rate) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Currency ${code} not found`,
    })
  }

  res.json({ data: rate })
})

ratesRouter.get('/:code/history', (req, res) => {
  const code = req.params.code.toUpperCase()
  const days = Number(req.query.days ?? DEFAULT_HISTORY_DAYS)

  if (!Number.isInteger(days) || days <= 0 || days > MAX_HISTORY_DAYS) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `Query parameter "days" must be a positive integer up to ${MAX_HISTORY_DAYS}`,
    })
  }

  const history = getRateHistory(code, days)

  if (history.length === 0) {
    return res.status(404).json({
      error: 'Not Found',
      message: `No history for currency ${code}`,
    })
  }

  res.json({ data: history })
})
