const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CacheTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A cache type must have a unique name'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
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

module.exports = mongoose.model('cachetype', CacheTypeSchema)
