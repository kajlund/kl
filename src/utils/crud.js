/**
 * Generic Resource CRUD handlers. Takes model as param
 */

const { CustomError } = require('./error')

/**
 * @desc     Get doc by id
 * @route    GET /api/resource/:id
 * @access   User/Admin
 */
const getOne = (model) => async (req, res, next) => {
  try {
    const doc = await model
      .findOne({ _id: req.params.id, deleted: false })
      .select('-deleted')
      .exec()

    if (!doc) {
      return next(new CustomError(`Not Found: ${id}`, 404))
    }

    res.status(200).json({ data: doc })
  } catch (e) {
    next(e)
  }
}

/**
 * @desc     Get all non-deleted documents
 * @route    GET /api/resource
 * @access   User/Admin
 */
const getMany = (model) => async (req, res, next) => {
  // If already filterd by filter-middleware
  if (res.results) return res.json(res.results)
  try {
    const docs = await model
      .find({ deleted: false })
      .select('-deleted -deletedAt -deletedBy')
      .exec()

    res.status(200).json({ data: docs })
  } catch (e) {
    next(e)
  }
}

/**
 * @desc     Create doc
 * @route    POST /api/resource
 * @access   User/Admin
 */
const createOne = (model) => async (req, res, next) => {
  try {
    const doc = await model.create(req.body)
    res.status(201).json({ data: doc })
  } catch (e) {
    next(e)
  }
}

/**
 * @desc     Update doc
 * @route    PUT /api/resource/id
 * @access   User/Admin
 */
const updateOne = (model) => async (req, res) => {
  try {
    const updatedDoc = await model
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .exec()

    if (!updatedDoc) {
      return next(new CustomError(`Not Found: ${req.params.id}`, 404))
    }

    res.status(200).json({ data: updatedDoc })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

/**
 * @desc     Remove doc. Actually marks as deleted by user
 * @route    DELETE /api/resource/id
 * @access   User/Admin
 */
const removeOne = (model) => async (req, res, next) => {
  try {
    const removed = await model.findByIdAndUpdate(
      req.params.id,
      {
        deleted: true,
        deletedAt: new Date(),
        deletedBy: req.user._id,
      },
      { new: true }
    )

    if (!removed) {
      return next(new CustomError(`Not Found: ${req.params.id}`, 404))
    }

    return res.status(200).json({ data: removed })
  } catch (e) {
    next(e)
  }
}

/**
 * @desc     Destroy doc. Actually remove
 * @route    DELETE /api/resource/id/destroy
 * @access   Admin
 */
const destroyOne = (model) => async (req, res, next) => {
  try {
    const removed = await model.findByIdAndRemove(req.params.id)

    if (!removed) {
      return next(new CustomError(`Not Found: ${req.params.id}`, 404))
    }

    return res.status(204).end()
  } catch (e) {
    next(e)
  }
}

/**
 * @desc     Restore soft-deleted doc
 * @route    GET /api/resource/id/restore
 * @access   Admin
 */
const restoreOne = (model) => async (req, res, next) => {
  try {
    const restored = await model.findByIdAndUpdate(
      req.params.id,
      {
        deleted: false,
        deletedAt: null,
        deletedBy: null,
      },
      { new: true }
    )

    if (!restored) {
      return next(new CustomError(`Not Found: ${req.params.id}`, 404))
    }

    return res.status(200).json({ data: restored })
  } catch (e) {
    next(e)
  }
}

exports.crudControllers = (model) => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model),
  destroyOne: destroyOne(model),
  restoreOne: restoreOne(model),
})
