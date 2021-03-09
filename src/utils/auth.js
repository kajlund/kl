const jwt = require('jsonwebtoken')

const cnf = require('../config')
const { User, roles } = require('../resources/user/user.model')
const { CustomError } = require('./error')

/**
 * Helper method for creating a jsonwebtoken containing user id
 */
const newToken = (user) => {
  return jwt.sign({ id: user.id }, cnf.secrets.jwt, {
    expiresIn: cnf.secrets.jwtExp,
  })
}

/**
 * Helper method for verifying jsonwebtoken
 */
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, cnf.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })
}

/**
 * Signup route handler creates new User prospect and returns Bearer token
 */
const signup = async (req, res, next) => {
  const { email, nick, password } = req.body

  // Validate nick, email & password
  if (!email || !password || !nick) {
    return next(
      new CustomError('Signup requires email, nick and password', 400)
    )
  }

  try {
    const user = await User.create({ email, nick, password })
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    next(e)
  }
}

/**
 * Signin route handler lets user logon with email and password.
 * Returns Bearer token if email exists and pwd matches
 */
const signin = async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next(new CustomError('Signin requires email and password', 401))
  }

  const invalid = new CustomError(
    'Signin requires valid email and password combination',
    401
  )
  try {
    const user = await User.findOne({ email }).select('email password')
    if (!user) {
      return next(invalid)
    }
    const match = await user.checkPassword(password)
    if (!match) {
      return next(invalid)
    }

    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    next(e)
  }
}

/**
 * Protect middleware in set on all /api/* routes.
 * It will verify jsonwebtoken and put user in req.user if token OK
 */
const protect = async (req, _res, next) => {
  const authError = new CustomError('Not authorized to access this route', 401)
  const bearer = req.headers.authorization

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return next(authError)
  }

  const token = bearer.split('Bearer ')[1].trim()
  let payload
  try {
    payload = await verifyToken(token)
  } catch (e) {
    return next(authError)
  }

  const user = await User.findById(payload.id).select('-password')
  if (!user) {
    return next(authError)
  }

  req.user = user
  next()
}

/**
 * admin-only protection middleware used in routing files before actual handler
 * Returns 401 if user.role !== 'admin'
 */
const adminOnly = async (req, _res, next) => {
  if (req.user.role !== roles.admin) {
    return next(new CustomError('Not authorized', 403))
  }
  next()
}

module.exports = {
  adminOnly,
  newToken,
  protect,
  signin,
  signup,
  verifyToken,
}
