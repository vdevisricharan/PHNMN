const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

/**
 * @swagger
 * tags:
 *   name: Stripe
 *   description: Stripe payment processing
 */

/**
 * @swagger
 * /api/checkout/payment:
 *   post:
 *     summary: Process a payment with Stripe
 *     tags: [Stripe]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tokenId
 *               - amount
 *             properties:
 *               tokenId:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Payment successful
 *       500:
 *         description: Payment failed
 */

router.post("/payment", async (req, res) => {
  try {
    const charge = await stripe.charges.create({
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "inr",
    });
    res.status(200).json(charge);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      return res.status(500).json({ error: "Payment failed." });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;