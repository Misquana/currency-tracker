import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { ratesRouter } from './routes/rates.js'
import { requestLogger } from './middleware/logger.js'
import { errorHandler } from './middleware/error-handler.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = join(__dirname, '..', '..', 'public')

export function createApp() {
  const app = express()

  app.use(requestLogger)
  app.use(express.static(PUBLIC_DIR))
  app.use('/api/rates', ratesRouter)

  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' })
  })

  app.use(errorHandler)

  return app
}
