export function formatRates(rawData) {
  if (!rawData?.Valute) {
    throw new Error('Invalid response: Valute field is missing')
  }
  const date = rawData.Date

  return Object.entries(rawData.Valute).map(([code, currency]) => ({
    code: code,
    name: currency.Name,
    value: Number((currency.Value / currency.Nominal).toFixed(4)),
    date: date,
  }))
}
