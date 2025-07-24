const Joi = require('joi');

exports.createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('', null),
  brand: Joi.string().allow('', null),
  category: Joi.string().required(),
  price: Joi.number().min(0).required(),
  sizes: Joi.array().items(Joi.string()).default([]),
  colors: Joi.array().items(Joi.string()).default([]),
  stock: Joi.number().integer().min(0).default(0),
  images: Joi.array().items(Joi.string().uri()).default([]),
  tags: Joi.array().items(Joi.string()).default([])
});

exports.updateProductSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow('', null),
  brand: Joi.string(),
  category: Joi.string(),
  price: Joi.number().min(0),
  sizes: Joi.array().items(Joi.string()),
  colors: Joi.array().items(Joi.string()),
  stock: Joi.number().integer().min(0),
  images: Joi.array().items(Joi.string().uri()),
  tags: Joi.array().items(Joi.string())
});
