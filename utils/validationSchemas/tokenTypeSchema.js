const Joi = require('joi');

module.exports = Joi
  .string()
  .alphanum()
  .regex(/[a-b][a-bA-B]/, { name: 'camelCased token type' })
  .allow('accessToken', 'refreshToken');
