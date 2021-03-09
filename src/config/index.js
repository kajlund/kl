/**
 * Create a default configuration object.
 * Read specifig env file if found and merge with default
 */

const fs = require('fs')
const path = require('path')

const { merge } = require('lodash')

const env = process.env.NODE_ENV || 'development'
const isDev = env === 'development'
const isTest = env === 'testing'
const port = process.env.PORT || 3000

const baseConfig = {
  env,
  isDev,
  isTest,
  port,
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: process.env.JWT_SECRET_EXPIRES,
  },
  db: {
    uri: process.env.MONGO_URI,
  },
  log: {
    // https://github.com/pinojs/hapi-pino#options
    enabled: true,
    level: isDev ? 'debug' : 'info', // "debug" | "info" | "warn" | "error" | "silent"
    logPayload: false,
    prettyPrint: isDev,
  },
}

let envConfig = {}
const envConfigFile = path.join(__dirname, `${env}.js`)
if (fs.existsSync(envConfigFile)) {
  envConfig = require(envConfigFile)
}

module.exports = merge(baseConfig, envConfig)
