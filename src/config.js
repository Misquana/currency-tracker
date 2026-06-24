export const CBR_API_URL = 'https://www.cbr-xml-daily.ru/daily_json.js'

export const SERVER_PORT = process.env.SERVER_PORT || 3000
export const API_KEY = process.env.API_KEY

export const DEFAULT_HISTORY_DAYS = 10
export const MAX_HISTORY_DAYS = 365

if (!process.env.API_KEY) {
  throw new Error('API_KEY environment variable is required')
}
