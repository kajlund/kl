const log = require('./log')

/**
 * Error class for creating custom error messages in controllers
 * Should contain info safe to send back to client.
 */
class CustomError extends Error {
  constructor(message = 'Internal Server Error', status = 500) {
    super(message)
    this.status = status
  }
}

/**
 * Generic Error Handling middleware. Will be called from controllers using next(e)
 */
const errorHandler = (err, req, res, next) => {
  let error = {
    status: err.status || 500,
    message: err.message || 'Internal Server Eror',
  }

  if (err.name && err.name === 'ValidationError') {
    error.status = 400
    error.message = 'Bad Request: Data validation failed'
  } else if (err.name && err.name === 'CastError') {
    // Faulty Mongoose ObjectId
    error.status = error.status || 404
    error.message = error.message || 'Not Found'
  } else if (err.name === 'MongoError') {
    switch (err.code) {
      case 11000: // Duplicate Key
        error.status = 417
        error.message = 'Expectation failed: Duplicate key value'
        break
      default:
        error.status = 400
        error.message = 'Bad Request'
    }
  }
  if (process.env.NODE_ENV === 'development') {
    error['stack'] = err.stack
  }
  if (error.status === 500) {
    log.error(err)
  }
  res.status(error.status).json(error)
}

module.exports = {
  errorHandler,
  CustomError,
}
