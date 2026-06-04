import { getLatestRate } from '../repository.js'
import { exitWithError, parseCurrencyCode } from './utils.js'

function main() {
  const { currencyCode } = parseCurrencyCode(process.argv[2], 'show')
  const rate = getLatestRate(currencyCode)

  if (!rate) {
    exitWithError(`Курс для ${currencyCode} не найден. Сначала запусти: npm run fetch`)
  }

  console.log(`${rate.currency_name} (${rate.currency_code})`)
  console.log(`Курс: ${rate.value} ₽`)
  console.log(`Дата: ${rate.rate_date}`)
  console.log(`Получено: ${rate.fetched_at}`)
}

main()
