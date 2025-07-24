const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');
const Payment = require('../../models/Payment');
const dotenv = require('dotenv');
dotenv.config();

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;

    await Payment.create({
      stripePaymentIntentId: intent.id,
      userId: intent.metadata.userId,
      orderId: intent.metadata.orderId,
      amount: intent.amount,
      status: 'succeeded',
      paidAt: new Date()
    });
  }

  res.json({ received: true });
};
