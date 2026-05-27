import { Router } from 'express'
import {
  getAllLatestRates,
  getLatestRate,
  getRateHistory,
} from '../../repository.js'

export const ratesRouter = Router()

// GET /api/rates/today
ratesRouter.get('/today', (req, res) => {
  const rates = getAllLatestRates()
  res.json({ data: rates })
})

// GET /api/rates/:code
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

// GET /api/rates/:code/history?days=30
ratesRouter.get('/:code/history', (req, res) => {
  const code = req.params.code.toUpperCase()
  const days = Number(req.query.days ?? 10)

  if (!Number.isInteger(days) || days <= 0 || days > 365) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Query parameter "days" must be a positive integer up to 365',
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
