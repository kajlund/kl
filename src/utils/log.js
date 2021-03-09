const cnf = require('../config')

/**
 * Creates shared logger instance according to cnf
 */
const log = require('pino')(cnf.log)
log.info(cnf.log, 'Logger configured')

module.exports = log
