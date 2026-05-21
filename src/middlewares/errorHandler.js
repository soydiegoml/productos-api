function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Error interno del servidor.',
  });
}

module.exports = { errorHandler };