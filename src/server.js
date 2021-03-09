/**
 * Server configures express server middleware and routes
 */

const path = require('path')

const cors = require('cors')
const express = require('express')

const cnf = require('./config')
const log = require('./utils/log')
const { errorHandler } = require('./utils/error')

const app = express()
const pino = require('pino-http')({ logger: log })

app.disable('x-powered-by')

app.use(pino) // http logging middleware

// app.use(express.static(path.join('..', __dirname, 'public')))
// app.get('/', (req, res) => {
//   res.redirect('/index.html')
// })

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
    app.listen(cnf.port, () => {
      log.info(`Server started at http://localhost:${cnf.port}`)
    })
  } catch (e) {
    log.error(e)
  }
}

/**
 * Server Route Configurations
 */

/**
 * Server 404 Handler
 */
// app.use((_req, res) => res.status(404).json({ message: 'Not Found' }))

/**
 * Generic Error Handling Middleware
 */
app.use(errorHandler)

module.exports = {
  app,
  start,
}
