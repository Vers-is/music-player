const Joi = require('joi');

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(8).required()
});

const registerSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(8).required(),
  email: Joi.string().email()
});

module.exports = {
  validateLogin: (data) => loginSchema.validate(data),
  validateRegister: (data) => registerSchema.validate(data)
};