import { fetchRawRates } from './fetcher.js'
import { formatRates } from './formatter.js'
import { saveRates, getAllLatestRates } from './repository.js'

async function main() {
  try {
    const raw = await fetchRawRates()
    const rates = formatRates(raw)
    saveRates(rates)
    console.log(`Сохранено курсов: ${rates.length}`)
    console.log('Последние сохранённые курсы:')
    console.table(getAllLatestRates())
  } catch (error) {
    console.error('Ошибка:', error.message)
    process.exit(1)
  }
}

main()
