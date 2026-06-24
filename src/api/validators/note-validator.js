export function validateCreateNote(body) {
  const errors = []

  if (!body || typeof body !== 'object') {
    console.error('Ошибка валидации: Тело запроса должно быть объектом')
    return { valid: false, errors: ['Тело запроса должно быть объектом'] }
  }
  let { currency_code, text } = body

  if (typeof currency_code !== 'string') {
    console.error('Ошибка валидации: currency_code должен быть строкой')
    errors.push('currency_code должен быть строкой')
  } else {
    currency_code = currency_code.trim().toUpperCase()
    if (currency_code.length !== 3) {
      console.error('Ошибка валидации: currency_code должен быть ровно 3 символа')
      errors.push('currency_code должен быть ровно 3 символа')
    }
  }

  if (typeof text !== 'string') {
    console.error('Ошибка валидации: text должен быть строкой')
    errors.push('text должен быть строкой')
  } else {
    text = text.trim()
    if (text.length < 1 || text.length > 500) {
      console.error('Ошибка валидации: text должен содержать от 1 до 500 символов')
      errors.push('text должен содержать от 1 до 500 символов')
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    value: { currency_code, text },
  }
}

export function validateUpdateNote(body) {
  const errors = []

  if (!body || typeof body !== 'object') {
    console.error('Ошибка валидации: Тело запроса должно быть объектом')
    return { valid: false, errors: ['Тело запроса должно быть объектом'] }
  }

  let { text } = body

  if (typeof text !== 'string') {
    console.error('Ошибка валидации: text должен быть строкой')
    errors.push('text должен быть строкой')
  } else {
    text = text.trim()
    if (text.length < 1 || text.length > 500) {
      console.error('Ошибка валидации: text должен содержать от 1 до 500 символов')
      errors.push('text должен содержать от 1 до 500 символов')
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    value: { text },
  }
}
