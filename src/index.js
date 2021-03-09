/**
 * App main entry point.
 * Loads environment variables (.env in root folder) and starts server
 */

const path = require('path')

const dotenv = require('dotenv')

// Load environment variables BEFORE setting up Server
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const log = require('./utils/log')

const server = require('./server')

log.info('Starting server')
server.start().catch((err) => {
  log.error(err)
  throw err // Get out of Dodge
})
