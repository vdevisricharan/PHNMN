const Payment = require('../models/Payment');
const dotenv = require('dotenv');
dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_KEY);

exports.createPaymentIntent = async (req, res) => {
  const { amount, currency = 'usd' } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency
  });

  res.status(200).json({ clientSecret: paymentIntent.client_secret });
};
