const Mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const { Schema } = Mongoose;

Mongoose.plugin(slug, { separator: '-', lang: 'en', truncate: 120 });

const VariantSchema = new Schema({
  name: { type: String, trim: true, required: true },
  color: { type: String, trim: true }, // Legacy field kept for backward compatibility/migration
  price: { type: Number, required: true },
  description: { type: String, trim: true }, // Variant description
  images: [{ type: String }],
  isDefault: { type: Boolean, default: false },
  // Optional service attributes
  duration: { type: String, trim: true },
  capacity: { type: String, trim: true },
  maxGuests: { type: String, trim: true },
  roomType: { type: String, trim: true },
  serviceType: { type: String, trim: true }
}, { _id: true });

const ProductSchema = new Schema({
  name: { type: String, trim: true, required: true },
  slug: { type: String, slug: 'name', unique: true },
  description: { type: String, trim: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', default: null },
  amenities: [{ type: String }], // Multi-select amenities
  variants: [VariantSchema],
  isActive: { type: Boolean, default: true },
  updated: Date,
  created: { type: Date, default: Date.now }
});

module.exports = Mongoose.model('Product', ProductSchema);
