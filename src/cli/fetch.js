import { fetchRawRates } from '../fetcher.js'
import { formatRates } from '../formatter.js'
import { saveRates } from '../repository.js'

async function main() {
  try {
    console.log('Получаем курсы с API ЦБ РФ...')
    const raw = await fetchRawRates()
    const rates = formatRates(raw)
    saveRates(rates)
    console.log(`Сохранено курсов: ${rates.length}`)
  } catch (error) {
    console.error('Ошибка:', error.message)
    process.exit(1)
  }
}

main()
