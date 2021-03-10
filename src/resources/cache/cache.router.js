/**
 * Municipalities resource route configuration
 */

const { Router } = require('express')
const { adminOnly, protect } = require('../../utils/auth')
const Cache = require('./cache.model')
const ctrl = require('./cache.controller')
const query = require('../../utils/query')

const router = Router()

router
  .route('/')
  .get(protect, query(Cache, 'cachetype municipality'), ctrl.getMany)
  .post(protect, ctrl.createOne)

router
  .route('/:id')
  .get(protect, ctrl.getOne)
  .put(protect, ctrl.updateOne)
  .delete(protect, ctrl.removeOne)

router.route('/:id/destroy').delete(protect, adminOnly, ctrl.destroyOne)
router.route('/:id/restore').get(protect, adminOnly, ctrl.restoreOne)

module.exports = router
