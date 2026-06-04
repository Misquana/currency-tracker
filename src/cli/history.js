import { getRateHistory } from '../repository.js'
import { exitWithError, parseCurrencyCode, parseDays } from './utils.js'

function main() {
  const args = process.argv.slice(2)
  const currencyCode = parseCurrencyCode(args[0], 'history')
  const limit = parseDays(args[1], 10)

  const rates = getRateHistory(currencyCode, limit)

  if (!rates || rates.length === 0) {
    exitWithError(`Курс для ${currencyCode} не найден. Сначала запусти: npm run fetch`)
  }

  console.table(rates)
}

main()
