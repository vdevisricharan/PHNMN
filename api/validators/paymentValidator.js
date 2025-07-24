const Joi = require('joi');

exports.createPaymentIntentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().default('usd'),
  metadata: Joi.object().optional(),
  payment_method_types: Joi.array().items(Joi.string()).default(['card'])
});
