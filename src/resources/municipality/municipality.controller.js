const { crudControllers } = require('../../utils/crud')

const MunicipalityModel = require('./municipality.model')

module.exports = crudControllers(MunicipalityModel)
