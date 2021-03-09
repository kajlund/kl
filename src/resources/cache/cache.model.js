const mongoose = require('mongoose')

const cacheSchema = new mongoose.Schema(
  {
    gc: {
      required: [true, 'A geocache must have a unique GC-code'],
      trim: true,
      type: String,
    },
    cachetype: {
      type: mongoose.SchemaTypes.ObjectId,
      required: [true, 'A geocache must have a cachetype'],
      ref: 'cachetype',
    },
    name: {
      required: [true, 'A geocache must have a name'],
      trim: true,
      type: String,
    },
    coords: {
      trim: true,
      type: String,
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    municipality: {
      type: mongoose.SchemaTypes.ObjectId,
      required: false,
      ref: 'municipality',
    },
    note: String,
    verified: {
      type: Boolean,
      default: false,
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

cacheSchema.index({ gc: 1 }, { unique: false })

module.exports = mongoose.model('cache', cacheSchema)
