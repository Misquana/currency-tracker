import { getRateHistory } from '../repository.js'

function parseArgs() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('Ошибка: неправильно составлен запрос npm run history -- <code> [N]')
    console.error('Пример: npm run history -- USD 15')
    process.exit(1)
  }

  if (typeof args[0] !== 'string') {
    console.error('Ошибка: <code> должен быть строкой')
    console.error('Пример: USD,EUR')
    process.exit(1)
  }

  if (!args[1]) {
    args[1] = '10'
  } else {
    if (!Number.isInteger(Number(args[1])) || Number(args[1]) <= 0) {
      console.error('Ошибка: [N] должен быть больше 0')
      console.error('Ошибка: [N] быть целым числом')
      process.exit(1)
    }
  }

  return {
    currencyCode: args[0].toUpperCase(),
    limit: args[1],
  }
}

function main() {
  const parsedArgs = parseArgs()
  const rates = getRateHistory(parsedArgs.currencyCode, parsedArgs.limit)

  if (!rates || rates.length === 0) {
    console.error(`Курс для ${parsedArgs.currencyCode} не найден. Сначала запусти: npm run fetch`)
    process.exit(1)
  }

  console.table(rates)
}

main()
