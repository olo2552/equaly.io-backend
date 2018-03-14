const Redis = require('../../config/redisInstance');
const joiValidate = require('../../utils/joiValidate');

const usernameSchema = require('../../utils/validationSchemas/usernameSchema');
const tokenTypeSchema = require('../../utils/validationSchemas/tokenTypeSchema');
const tokenSchema = require('../../utils/validationSchemas/tokenSchema');

const revokeUserTokenFromDB = redis =>
  tokenType => (username, token) => {
    if (!joiValidate([
      [tokenType, tokenTypeSchema],
      [token, tokenSchema],
      [username, usernameSchema],
    ])) {
      throw Error('one of parameters have invalid format');
    }

    if (tokenType === 'accessToken') {
      redis.hdel(`access_tokens.${username}`, token);
    } else {
      redis.del(`refresh_token.${username}`);
    }

    return 'Token revoked!';
  };

module.exports = {
  revokeUserTokenFromDB: revokeUserTokenFromDB(Redis),
  revokeUserTokenFromDBFactory: revokeUserTokenFromDB,
};
