// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: [String],
  images: [String],
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // percentage
  sizes: [String],
  colors: [String],
  stock: {
    type: Map,
    of: Number // e.g., { "S": 10, "M": 5 }
  },
  tags: [String],
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
