const CBR_API_URL = 'https://www.cbr-xml-daily.ru/daily_json.js'

export async function fetchRawRates() {
  const response = await fetch(CBR_API_URL)

  if (!response.ok) {
    throw new Error('CBR API returned status 500')
  }
  const json = await response.json()
  return json
}
