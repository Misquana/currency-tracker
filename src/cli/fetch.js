import { fetchRawRates } from '../fetcher.js'
import { formatRates } from '../formatter.js'
import { saveRates, upsertCurrencies } from '../repository.js'

async function main() {
  try {
    console.log('Получаем курсы с API ЦБ РФ...')
    const raw = await fetchRawRates()
    const rates = formatRates(raw)
    const uniqueCurrencies = Array.from(
      new Map(rates.map(rate => [rate.code, { code: rate.code, name: rate.name }])).values())
    upsertCurrencies(uniqueCurrencies)
    console.log(`Обновлён справочник валют: ${uniqueCurrencies.length}`)
    saveRates(rates)
    console.log(`Сохранено курсов: ${rates.length}`)
  } catch (error) {
    console.error('Ошибка:', error.message)
    process.exit(1)
  }
}

main()
