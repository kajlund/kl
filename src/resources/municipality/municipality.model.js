const mongoose = require('mongoose')

const municipalitySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'A municipality must have a code'],
      unique: true,
      minlength: [3, 'Code must be 3 digts long'],
      maxlength: [3, 'Code must be 3 digts long'],
      match: [/^\d+$/, 'Numbers 0-9 only'],
    },
    name: {
      type: String,
      required: [true, 'A municipality must have a unique name'],
      trim: true,
    },
    alias: {
      type: String,
      trim: true,
      default: '',
    },
    lat: {
      type: Number,
      default: 0,
    },
    lng: {
      type: Number,
      default: 0,
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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

municipalitySchema.index({ alias: 1 }, { unique: false })
municipalitySchema.index({ name: 1 }, { unique: false })

module.exports = mongoose.model('municipality', municipalitySchema)
