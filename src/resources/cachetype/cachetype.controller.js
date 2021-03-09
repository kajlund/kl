const { crudControllers } = require('../../utils/crud')

const CacheTypeModel = require('./cachetype.model')

module.exports = crudControllers(CacheTypeModel)
