const Redis = require('../../config/redisInstance');
const Joi = require('joi');

const usernameSchema = require('../../utils/validationSchemas/usernameSchema');
const tokenSchema = require('../../utils/validationSchemas/tokenSchema');
const tokenTypeSchema = require('../../utils/validationSchemas/tokenTypeSchema');

// the code is very verbose, possible later refactor:
// axtract tokenType cases into different funcs and just group them here
// also validate util should be strongly concerned

const setUserToken = redis => joi =>
  tokenType =>
    (username, token) => {

      const tokenTypeValidation = joi.validate(tokenType, tokenTypeSchema);
      if (tokenTypeValidation.error !== null) {
        throw new Error(tokenTypeValidation.error.message);
      }

      const tokenValidation = joi.validate(token, tokenSchema);
      if (tokenValidation.error !== null) {
        throw new Error(tokenValidation.error.message);
      }

      const usernameValidation = joi.validate(username, usernameSchema);
      if (usernameValidation.error !== null) {
        throw new Error(usernameValidation.error.message);
      }

      if (tokenType === 'accessToken') {
        redis.sadd(`access_tokens.${username}`, token);
      } else {
        redis.set(`refresh_token.${username}`, token);
      }

      return `${tokenType} successfully set!`;
    };

module.exports = {
  setUserToken: setUserToken(Redis)(Joi),
  setUserTokenFactory: setUserToken,
};
