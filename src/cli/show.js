import { getLatestRate } from '../repository.js'

function parseArgs() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('Использование: npm run show -- <CODE>')
    console.error('Пример: npm run show -- USD')
    process.exit(1)
  }
  return { currencyCode: args[0].toUpperCase() }
}

function main() {
  const { currencyCode } = parseArgs()
  const rate = getLatestRate(currencyCode)

  if (!rate) {
    console.error(`Курс для ${currencyCode} не найден. Сначала запусти: npm run fetch`)
    process.exit(1)
  }

  console.log(`${rate.currency_name} (${rate.currency_code})`)
  console.log(`Курс: ${rate.value} ₽`)
  console.log(`Дата: ${rate.rate_date}`)
  console.log(`Получено: ${rate.fetched_at}`)
}

main()
