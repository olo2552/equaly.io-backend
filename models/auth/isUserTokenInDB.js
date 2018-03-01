const Redis = require('../../config/redisInstance');
const Joi = require('joi');

const usernameSchema = require('../../utils/validationSchemas/usernameSchema');
const tokenSchema = require('../../utils/validationSchemas/tokenSchema');
const tokenTypeSchema = require('../../utils/validationSchemas/tokenTypeSchema');

const checkUserToken = redis => joi =>
  tokenType =>
    (username, token) => {
      const tokenTypeVadation = joi.validate(tokenType, tokenTypeSchema);
      if (tokenTypeVadation.error !== null) {
        return Promise.reject(new Error(tokenTypeVadation.error.message));
      }

      const tokenVadation = joi.validate(token, tokenSchema);
      if (tokenVadation.error !== null) {
        return Promise.reject(new Error(tokenVadation.error.message));
      }

      const usernameValidation = joi.validate(username, usernameSchema);
      if (usernameValidation.error !== null) {
        return Promise.reject(new Error(usernameValidation.error.message));
      }

      if (tokenType === 'refreshToken') {
        return redis.get(`refresh_token.${username}`)
          // redis returns 0 if query doesn't matches db
          .then(dbResponse => dbResponse !== null && dbResponse === token);
      }

      return redis.sismember(`access_token.${username}`, token)
        // redis returns 0 if query doesn't matches db
        .then(dbResponse => dbResponse !== 0);
    };

module.exports = {
  checkUserToken: checkUserToken(Redis)(Joi),
  checkUserTokenFactory: checkUserToken,
};
