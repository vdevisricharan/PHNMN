// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  stripePaymentIntentId: String,
  stripeChargeId: String,
  amount: Number,
  currency: { type: String, default: 'usd' },
  method: String,
  status: {
    type: String,
    enum: ['succeeded', 'failed', 'refunded', 'pending'],
    default: 'pending'
  },
  paidAt: Date,
  refundId: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
