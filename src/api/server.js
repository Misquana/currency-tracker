import express from 'express'
import { ratesRouter } from './routes/rates.js'
import { requestLogger } from './middleware/logger.js'
import { errorHandler } from './middleware/error-handler.js'

const PORT = 3000

const app = express()

app.use(requestLogger)

app.use('/api/rates', ratesRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
