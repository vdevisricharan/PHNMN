// models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  size: String,
  color: String,
  quantity: Number,
  price: Number
}, { _id: false });

const addressSnapshotSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  addressSnapshot: addressSnapshotSchema,
  items: [orderItemSchema],
  subtotal: Number,
  discount: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  totalAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  couponCode: String,
  placedAt: { type: Date, default: Date.now },
  cancelledAt: Date
});

module.exports = mongoose.model('Order', orderSchema);
