const Joi = require('joi');

// username validation is based on this post, but it need futher judgement and reserch
// https://steemit.com/utopian-io/@netuoso/steemcreate-improved-account-name-validation

module.exports = Joi
  .string()
  .required()
  .trim()
  .min(3)
  .max(16)
  .lowercase()
  .regex(/^[a-zA-Z]/, { name: 'starts with a letter' })
  .regex(/[a-zA-Z0-9]$/, { name: 'ends with a letter' })
  .regex(/[a-zA-Z0-9\-.]/, { name: 'contain only letters, digits, dashes and dots' });
// TODO: Need to get working regex below - if(dot is in text) ... else do nothing
// .regex(/([a-zA-Z]|[0-9]){3,}\./g) // username segments splitted by dots need to be at least 3 characters long each
