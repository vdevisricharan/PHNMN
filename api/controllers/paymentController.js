const Payment = require('../../models/Payment');
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');

exports.createPaymentIntent = async (req, res) => {
  const { amount, currency = 'usd' } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency
  });

  res.status(200).json({ clientSecret: paymentIntent.client_secret });
};
