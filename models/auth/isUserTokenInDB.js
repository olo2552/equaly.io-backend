const Redis = require('../../config/redisInstance');

const joiValidate = require('../../utils/joiValidate');

const usernameSchema = require('../../utils/validationSchemas/usernameSchema');
const tokenSchema = require('../../utils/validationSchemas/tokenSchema');
const tokenTypeSchema = require('../../utils/validationSchemas/tokenTypeSchema');

const checkUserToken = redis =>
  tokenType =>
    (username, token) => {
      if (!joiValidate([
        [tokenType, tokenTypeSchema],
        [username, usernameSchema],
        [token, tokenSchema],
      ])) {
        return Promise.reject(Error('One of parameters is not valid.'));
      }

      if (tokenType === 'refreshToken') {
        return redis.get(`refresh_token.${username}`)
          // redis returns 0 if query doesn't matches db
          .then(dbResponse => dbResponse !== null && dbResponse === token);
      }

      return redis.hexists(`access_tokens.${username}`, token)
        // redis returns 0 if query doesn't matches db
        .then(dbResponse => dbResponse !== 0);
    };

module.exports = {
  checkUserToken: checkUserToken(Redis),
  checkUserTokenFactory: checkUserToken,
};
