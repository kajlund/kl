const mongoose = require('mongoose')
const cnf = require('../config')

/**
 * Connects to DB as configured in cnf
 */
exports.connect = (url = cnf.db.uri, opts = {}) => {
  return mongoose.connect(url, {
    ...opts,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}
