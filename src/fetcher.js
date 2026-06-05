import { CBR_API_URL } from './config.js'

/**
 * HTTP-запрос к API ЦБ для получения данных о курсах валют.
 *
 * @returns {Promise<Object>} Promise который разрешается в объект с данными от API ЦБ
 * @throws {Error}
 */
export async function fetchRawRates() {
  const response = await fetch(CBR_API_URL)

  if (!response.ok) {
    throw new Error('CBR API returned status 500')
  }
  const json = await response.json()
  return json
}
