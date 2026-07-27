const logger = require('../config/logger');
class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
const globalErrorHandler = (err, req, res, next) => {

  let statusCode = err.statusCode || 500;
  if (statusCode < 400 || statusCode > 599) {
    statusCode = 500;
  }
  const isOperational = err.isOperational || false;

  logger.error(
    {
      err,
      path: req.originalUrl,
      method: req.method,
      statusCode,
    },
    err.message
  );
  res.status(statusCode).json({
    success: false,
    message: isOperational ? err.message : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
const notFoundHandler = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};
module.exports = { AppError, asyncHandler, globalErrorHandler, notFoundHandler };