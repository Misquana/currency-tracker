/* eslint-disable no-undef */
const API_BASE = '/api/rates'

async function fetchTodayRates() {
  const response = await fetch(`${API_BASE}/today`)
  if (!response.ok) {
    throw new Error(`Failed to load rates: ${response.status}`)
  }
  const body = await response.json()
  return body.data
}

async function fetchHistory(code, days, { signal } = {}) {
  const url = `${API_BASE}/${code}/history?days=${days}`
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`Failed to load history: ${response.status}`)
  }
  const body = await response.json()
  return body.data
}

const tbody = document.getElementById('rates-tbody')

function renderTableLoading() {
  tbody.replaceChildren()
  const tr = document.createElement('tr')
  const td = document.createElement('td')
  td.colSpan = 4
  td.className = 'rates-table__placeholder'
  td.textContent = 'Загрузка...'
  tr.append(td)
  tbody.append(tr)
}

function renderRatesTable(rates) {
  tbody.replaceChildren()

  if (rates.length === 0) {
    const tr = document.createElement('tr')
    const td = document.createElement('td')
    td.colSpan = 4
    td.className = 'rates-table__placeholder'
    td.textContent = 'Нет данных. Запусти npm run fetch.'
    tr.append(td)
    tbody.append(tr)
    return
  }

  for (const rate of rates) {
    const tr = document.createElement('tr')

    const codeCell = document.createElement('td')
    codeCell.textContent = rate.currency_code

    const nameCell = document.createElement('td')
    nameCell.textContent = rate.currency_name

    const valueCell = document.createElement('td')
    valueCell.textContent = rate.value.toFixed(4)

    const dateCell = document.createElement('td')
    dateCell.textContent = formatDate(rate.rate_date)

    tr.append(codeCell, nameCell, valueCell, dateCell)
    tbody.append(tr)
  }
}

function renderTableError(message) {
  tbody.replaceChildren()
  const tr = document.createElement('tr')
  const td = document.createElement('td')
  td.colSpan = 4
  td.className = 'rates-table__placeholder'
  td.textContent = `Ошибка: ${message}`
  tr.append(td)
  tbody.append(tr)
}

function formatDate(isoString) {
  const date = new Date(isoString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const canvas = document.getElementById('rate-chart')
const chartPlaceholder = document.getElementById('chart-placeholder')

function renderChartLoading() {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
  chartPlaceholder.textContent = `Загрузка...`
  chartPlaceholder.style.display = 'flex'
}

let chartInstance = null
function renderChart(history) {
  const sorted = [...history].reverse()

  const labels = sorted.map(point => formatDate(point.rate_date))
  const values = sorted.map(point => point.value)

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartPlaceholder.style.display = 'none'

  chartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Курс, ₽',
        data: values,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.2,
        fill: true,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: false },
      },
    },
  })
}

function renderChartError(message) {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
  chartPlaceholder.textContent = `Ошибка: ${message}`
  chartPlaceholder.style.display = 'flex'
}

async function loadTodayRates() {
  renderTableLoading()
  try {
    const rates = await fetchTodayRates()
    renderRatesTable(rates)
  } catch (error) {
    console.error(error)
    renderTableError(error.message)
  }
}

const currencySelect = document.getElementById('currency-select')
const periodSelect = document.getElementById('period-select')

let historyAbortController = null

async function loadHistory() {
  if (historyAbortController) {
    historyAbortController.abort()
  }
  historyAbortController = new AbortController()
  const signal = historyAbortController.signal

  const code = currencySelect.value
  const days = Number(periodSelect.value)

  renderChartLoading()

  try {
    const history = await fetchHistory(code, days, { signal })
    renderChart(history)
  } catch (error) {
    if (error.name === 'AbortError') {
      return
    }
    console.error(error)
    renderChartError(error.message)
  }
}

function init() {
  loadTodayRates()
  loadHistory()

  currencySelect.addEventListener('change', loadHistory)
  periodSelect.addEventListener('change', loadHistory)
}

init()
