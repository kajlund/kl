const { crudControllers } = require('../../utils/crud')

const CacheModel = require('./cache.model')

module.exports = crudControllers(CacheModel)
