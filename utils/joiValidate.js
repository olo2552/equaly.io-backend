const Joi = require('joi');
const _ = require('lodash'); 

const joiValidate = (toValidate, schema) => {
  if (_.isArray(toValidate)) {
    return toValidate
      .map(([dataToValidate, entrySchema]) => {
        return !_.has(Joi.validate(dataToValidate, entrySchema), 'error.message')
      })
      .every(validationResult => !!validationResult)
  }

  return !_.has(Joi.validate(toValidate, schema), 'error.message');
};

module.exports = joiValidate;
