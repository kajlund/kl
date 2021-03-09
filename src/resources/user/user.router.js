/**
 * User resource route configuration
 */

const { Router } = require('express')
const { adminOnly, protect } = require('../../utils/auth')
const ctrl = require('./user.controller')

const router = Router()

router
  .route('/')
  .get(protect, adminOnly, ctrl.getMany)
  .put(protect, ctrl.updateMe)
  .post(protect, adminOnly, ctrl.createOne)

router.get('/me', protect, ctrl.getMe)
router.get('/:id/restore', protect, adminOnly, ctrl.restoreOne)
router.delete('/:id/destroy', protect, adminOnly, ctrl.destroyOne)

router
  .route('/:id')
  .get(protect, adminOnly, ctrl.getOne)
  .put(protect, adminOnly, ctrl.updateOne)
  .delete(protect, adminOnly, ctrl.removeOne)

module.exports = router
