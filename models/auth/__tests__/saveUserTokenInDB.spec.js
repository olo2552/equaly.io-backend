require('dotenv').config();

const Redis = require('ioredis');
const Joi = require('joi');

const mockRedis = new Redis({
  host: process.env.DB_MOCK_HOST,
  port: process.env.DB_MOCK_PORT,
});

const { setUserTokenFactory } = require('../saveUserTokenInDB');

const setUserToken = setUserTokenFactory(mockRedis)(Joi);

/* eslint-disable no-undef */
describe('setUserToken', () => {
  const jwtPattern = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
  const usernamePattern = 'olo2552';
  const accessTokenSuccessMessage = 'accessToken successfully set!';

  beforeEach(() => {
    mockRedis.flushdb();
  });

  it('should work without crashing', () => {
    expect(setUserToken('accessToken')(usernamePattern, jwtPattern));
  });

  it('should throw error for incorrect tokenType', () => {
    expect(() => setUserToken('userToken')(usernamePattern, jwtPattern))
      .toThrowError();

    expect(() => setUserToken('')('$56346', jwtPattern))
      .toThrowError();
  });

  it('should throw error for incorrect username', () => {
    expect(() => setUserToken('accessToken')('', jwtPattern))
      .toThrowError();

    expect(() => setUserToken('accessToken')('$56346', jwtPattern))
      .toThrowError();
  });

  it('should throw Error for incorrect token', () => {
    expect(() => setUserToken('accessToken')('olo2552', ''))
      .toThrowError();

    expect(() => setUserToken('accessToken')('olo2552', '%6;lkajdf.asdf.asdf((*'))
      .toThrowError();
  });

  it('should return success message for correct data', () => {
    expect(setUserToken('accessToken')('olo2552', jwtPattern))
      .toBe(accessTokenSuccessMessage);
  });

  it('should save Set when given accessToken', () => {
    setUserToken('accessToken')(usernamePattern, jwtPattern);

    expect.assertions(1);
    return expect(mockRedis.type(`access_tokens.${usernamePattern}`))
      .resolves.toBe('set');
  });

  it('should save string when given refreshToken', () => {
    setUserToken('refreshToken')(usernamePattern, jwtPattern);

    expect.assertions(1);
    return expect(mockRedis.type(`refresh_token.${usernamePattern}`))
      .resolves.toBe('string');
  });
});
