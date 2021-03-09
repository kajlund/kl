/**
 * User resource controller methods
 */

const { crudControllers } = require('../../utils/crud')

const { User } = require('./user.model')
const { CustomError } = require('../../utils/error')

/**
 * @desc     Return logged in user's info
 * @route    GET /api/users
 * @access   Private
 */
const getMe = (req, res) => {
  res.status(200).json({ data: req.user })
}

/**
 * @desc     Update logged in user's info
 * @route    GET /api/users
 * @access   Private
 */
const updateMe = async (req, res, next) => {
  const { nick } = req.body
  if (!nick.trim()) {
    return next(new CustomError('You must provide a nick to update', 400))
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { nick },
      { new: true }
    )
      .lean()
      .exec()

    res.status(200).json({ data: user })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  ...crudControllers(User),
  getMe,
  updateMe,
}
