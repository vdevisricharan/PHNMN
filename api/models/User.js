const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  label: String,
  fullName: String,
  phone: String,
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  isDefault: Boolean,
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  size: String,
  color: String,
  quantity: { type: Number, default: 1 },
  addedAt: { type: Date, default: Date.now }
}, { _id: false });

const wishlistItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  addedAt: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  phone: String,
  stripeCustomerId: String,
  isAdmin: { type: Boolean, default: false },

  cart: [cartItemSchema],
  wishlist: [wishlistItemSchema],
  addresses: [addressSchema],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
