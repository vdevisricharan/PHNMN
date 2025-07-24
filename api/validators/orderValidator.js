const Joi = require('joi');
const mongoose = require('mongoose');

const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message(`"${helpers.state.path}" must be a valid ObjectId`);
  }
  return value;
};

exports.placeOrderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().custom(objectIdValidator).required(),
      quantity: Joi.number().integer().min(1).required(),
      size: Joi.string().optional(),
      color: Joi.string().optional()
    })
  ).min(1).required(),

  addressSnapshot: Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required()
  }).required(),

  subtotal: Joi.number().min(0).required(),
  totalAmount: Joi.number().min(0).required()
});
