/**
 * Server configures express server middleware and routes
 */

const path = require('path')

const cors = require('cors')
const express = require('express')

const cnf = require('./config')
const log = require('./utils/log')
const { connect } = require('./utils/db')
const { errorHandler } = require('./utils/error')
const { signin, signup } = require('./utils/auth')

const app = express()
const pino = require('pino-http')({ logger: log })

app.disable('x-powered-by')

app.use(pino) // http logging middleware

// REST Server
app.use(cors())
app.use(express.json({ limit: '100kb' })) // Limit input data size
app.use(express.urlencoded({ extended: true }))

app.use(
  express.static(path.join(__dirname, '..', 'public'), { index: 'index.html' })
)

/**
 * Start HTTP Server
 */
const start = async () => {
  try {
    await connect() // Connect DB
    app.listen(cnf.port, () => {
      log.info(`Server started on http://localhost:${cnf.port}`)
    })
  } catch (e) {
    log.error(e)
  }
}

/**
 * Server Route Configurations
 */
app.post('/api/signin', signin)
app.post('/api/signup', signup)
app.use('/api/users', require('./resources/user/user.router'))
app.use('/api/cachetypes', require('./resources/cachetype/cachetype.router'))
app.use(
  '/api/municipalities',
  require('./resources/municipality/municipality.router')
)
app.use('/api/caches', require('./resources/cache/cache.router'))

/**
 * Server 404 Handler
 */
app.use((_req, res) => res.status(404).json({ message: 'Not Found' }))

/**
 * Generic Error Handling Middleware
 */
app.use(errorHandler)

module.exports = {
  app,
  start,
}
