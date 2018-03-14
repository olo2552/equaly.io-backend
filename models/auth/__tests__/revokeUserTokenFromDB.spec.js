require('dotenv').config();

const Redis = require('ioredis');

const mockRedis = new Redis({
  port: process.env.DB_MOCK_PORT,
  host: process.env.DB_MOCK_HOST,
});


const { revokeUserTokenFromDBFactory } = require('../revokeUserTokenFromDB');
const { setUserTokenFactory } = require('../saveUserTokenInDB');
const { checkUserTokenFactory } = require('../isUserTokenInDB');

const setUserToken = setUserTokenFactory(mockRedis);
const checkUserToken = checkUserTokenFactory(mockRedis);

const revokeUserTokenFromDB = revokeUserTokenFromDBFactory(mockRedis);
const jwtPattern = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o';
const usernamePattern = 'olo2552';
const refreshTokenTypePattern = 'refreshToken';
const accessTokenTypePattern = 'accessToken';
const tokenExpiryDatePattern = Date.now() + 30000000;

/* eslint-disable no-undef */
describe('revokeUserTokenFromDB', () => {
  afterEach(() => {
    mockRedis.flushall();
  });

  beforeEach(() => {
    setUserToken(accessTokenTypePattern)(usernamePattern, jwtPattern, tokenExpiryDatePattern);
    setUserToken(refreshTokenTypePattern)(usernamePattern, jwtPattern);
  });

  it('should work without crashing', () => {
    expect(revokeUserTokenFromDB());
  });

  it('should throw error when given incorrect input', () => {
    expect(() => revokeUserTokenFromDB('')(usernamePattern, jwtPattern))
      .toThrowError();

    expect(() => revokeUserTokenFromDB(accessTokenTypePattern)('', jwtPattern))
      .toThrowError();

    expect(() => revokeUserTokenFromDB(accessTokenTypePattern)(usernamePattern, ''))
      .toThrowError();
  });

  it('should return message after deleting the token', () => {
    expect(revokeUserTokenFromDB(accessTokenTypePattern)(usernamePattern, jwtPattern))
      .toBe('Token revoked!');
  });

  it('should delete accessToken correctly', () => {
    revokeUserTokenFromDB(accessTokenTypePattern)(usernamePattern, jwtPattern);

    expect.assertions(1);

    return expect(checkUserToken(accessTokenTypePattern)(usernamePattern, jwtPattern))
      .resolves.toBe(false);
  });

  it('should delete accessToken correctly', () => {
    revokeUserTokenFromDB(refreshTokenTypePattern)(usernamePattern, jwtPattern);

    expect.assertions(1);

    return expect(checkUserToken(refreshTokenTypePattern)(usernamePattern, jwtPattern))
      .resolves.toBe(false);
  });
});
