import { fetchRawRates } from './fetcher.js'
import { formatRates } from './formatter.js'

async function main() {
  try {
    const raw = await fetchRawRates()
    const rates = formatRates(raw)
    console.table(rates)
  } catch (error) {
    console.error('Не удалось получить курсы:', error.message)
    process.exit(1)
  }
}

main()
