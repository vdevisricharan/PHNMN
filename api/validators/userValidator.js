const Joi = require('joi');

exports.registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/),
  dateOfBirth: Joi.date().iso().max('now')
});

exports.updateProfileSchema = Joi.object({
  name: Joi.string(),
  phone: Joi.string().pattern(/^[0-9]{10}$/),
  dateOfBirth: Joi.date().iso().max('now')
});

exports.addressSchema = Joi.object({
  type: Joi.string().valid('home', 'office', 'other').default('home'),
  fullName: Joi.string().required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  street: Joi.string().required(),
  locality: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  postalCode: Joi.string().pattern(/^[0-9]{6}$/).required(),
  country: Joi.string().default('India'),
  isDefault: Joi.boolean().default(false)
});

exports.walletTransactionSchema = Joi.object({
  amount: Joi.number().positive().required(),
  description: Joi.string().required()
});
