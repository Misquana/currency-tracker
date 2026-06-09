import { createApp } from './app.js'
import { SERVER_PORT } from '../config.js'

const app = createApp()

app.listen(SERVER_PORT, () => {
  console.log(`Server running on http://localhost:${SERVER_PORT}`)
})
