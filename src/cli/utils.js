export function exitWithError(message) {
  console.error(message)
  process.exit(1)
}

export function parseCurrencyCode(arg, scriptName) {
  if (!arg) {
    exitWithError(`Использование: npm run ${scriptName} -- <CODE>`)
  }
  return arg.toUpperCase()
}

export function parseDays(arg, defaultValue) {
  if (arg === undefined) {
    return defaultValue
  }
  const days = Number(arg)
  if (!Number.isInteger(days) || days <= 0) {
    exitWithError('Количество дней должно быть положительным целым числом')
  }
  return days
}
