/**
 * User resource model and schema plus roles array
 */

const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const mongoose = require('mongoose')

const roles = {
  prospect: 'prospect',
  member: 'member',
  admin: 'admin',
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'A user account needs a valid email address'],
      unique: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email address needs a valid format',
      ],
    },
    nick: {
      type: String,
      required: [true, 'A user accounds needs to have a nickname'],
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, 'A user account needs a password.'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.keys(roles),
      required: true,
      default: roles.prospect,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    deletedBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true }
)

userSchema.virtual('avatar').get(function () {
  return gravatar.url(this.email, { s: '200', r: 'pg', d: 'mm' })
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err)
      }
      resolve(same)
    })
  })
}

userSchema.set('toObject', { virtuals: true })
userSchema.set('toJSON', { virtuals: true })

const User = mongoose.model('user', userSchema)

module.exports = {
  roles,
  User,
}
