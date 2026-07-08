const Mongoose = require('mongoose');
const { Schema } = Mongoose;

const FacilitySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

FacilitySchema.index({ displayOrder: 1 });

module.exports = Mongoose.model('Facility', FacilitySchema);
