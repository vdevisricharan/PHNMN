// models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  size: String,
  color: String,
  quantity: Number,
  price: Number,
  discountedPrice: Number
}, { _id: false });

const addressSchema = new mongoose.Schema({
  type: { type: String, enum: ['home', 'office', 'other'] },
  fullName: String,
  phone: String,
  street: String,
  locality: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  isDefault: Boolean,
  createdAt: Date
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [orderItemSchema],
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  subtotal: Number,
  discount: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: Number,
  paymentMethod: { type: String, enum: ['card', 'wallet', 'cod'] },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  trackingNumber: String,
  pointsEarned: { type: Number, default: 0 },
  pointsUsed: { type: Number, default: 0 },
  estimatedDelivery: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
