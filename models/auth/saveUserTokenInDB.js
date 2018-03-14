const Redis = require('../../config/redisInstance');

const joiVaidate = require('../../utils/joiValidate');

const usernameSchema = require('../../utils/validationSchemas/usernameSchema');
const tokenSchema = require('../../utils/validationSchemas/tokenSchema');
const tokenTypeSchema = require('../../utils/validationSchemas/tokenTypeSchema');
const tokenExpiryDateSchema = require('../../utils/validationSchemas/tokenExpiryDateSchema');

// the code is very verbose, possible later refactor:
// extract tokenType cases into different funcs and just group them here
// also validate util should be strongly concerned

const setUserToken = redis =>
  tokenType =>
    (username, token, tokenExpiryDate) => {
      if (!joiVaidate([
        [tokenType, tokenTypeSchema],
        [username, usernameSchema],
        [token, tokenSchema],
      ])) {
        throw Error('One of the passed parameters is not valid');
      }

      if (tokenType === 'accessToken') {
        if (!joiVaidate([[tokenExpiryDate, tokenExpiryDateSchema]])) {
          throw Error('One of the passed parameters is not valid');
        }

        redis.hset(`access_tokens.${username}`, token, tokenExpiryDate);
      } else {
        redis.set(`refresh_token.${username}`, token);
      }

      return `${tokenType} successfully set!`;
    };

module.exports = {
  setUserToken: setUserToken(Redis),
  setUserTokenFactory: setUserToken,
};
