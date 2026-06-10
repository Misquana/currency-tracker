/**
 * Преобразует  данные от API ЦБ в массив объектов курсов валют.
 *
 * @param {Object} rawData — данные от API
 * @param {string} rawData.Date — дата курсов в формате
 * @param {Object.<string, {Name: string, Value: number, Nominal: number}>}
 * @returns {Array<{code: string, name: string, value: number, date: string}>}
 */
export function formatRates(rawData) {
  if (!rawData || !rawData.Valute) {
    throw new Error('Valute property is missing')
  }

  const date = rawData.Date

  return Object.entries(rawData.Valute).map(([code, currency]) => ({
    code: code,
    name: currency.Name,
    value: Number((currency.Value / currency.Nominal).toFixed(4)),
    date: date,
  }))
}
