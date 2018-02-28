const Joi = require('joi');

// validation schema taken from here:
// https://github.com/hapijs/joi/issues/992

module.exports = Joi
  .string()
  .trim()
  .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/, {
    name: 'JSON Web Token',
  }) // checking full JWT integration
  .required();
