export function errorHandler(err, req, res, _next) {
  console.error('Unhandled error:', err)
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  })
}
