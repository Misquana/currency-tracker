import { API_KEY } from '../../config.js'

export function apiKeyAuth(req, res, next) {
  const userApiKey = req.get('X-API-Key')

  if (!userApiKey || userApiKey !== API_KEY) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Ключ неверный или отсутствует',
    })
  }

  next()
}
