require('dotenv').config();

const Redis = require('ioredis');

const mockRedis = new Redis({
  host: process.env.DB_MOCK_HOST,
  port: process.env.DB_MOCK_PORT,
});

const { setUserTokenFactory } = require('../saveUserTokenInDB');

const setUserToken = setUserTokenFactory(mockRedis);

/* eslint-disable no-undef */
describe('setUserToken', () => {
  const jwtPattern = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
  const usernamePattern = 'olo2552';
  const accessTokenSuccessMessage = 'accessToken successfully set!';
  const tokenExpiryDatePattern = Date.now() + 300000;

  beforeEach(() => {
    mockRedis.flushdb();
  });

  it('should work without crashing', () => {
    expect(setUserToken('refreshToken')(usernamePattern, jwtPattern));
  });


  it('should throw error for incorrect data', () => {
    expect(() => setUserToken('userToken')(usernamePattern, jwtPattern))
      .toThrowError();

    expect(() => setUserToken('')('$56346', jwtPattern))
      .toThrowError();

    expect(() => setUserToken('accessToken')('', jwtPattern, tokenExpiryDatePattern))
      .toThrowError();

    expect(() => setUserToken('accessToken')('$56346', jwtPattern, tokenExpiryDatePattern))
      .toThrowError();

    expect(() => setUserToken('accessToken')('olo2552', ''))
      .toThrowError();

    expect(() => setUserToken('accessToken')('olo2552', '%6;lkajdf.asdf.asdf((*'))
      .toThrowError();
  });

  it('should return success message for correct data', () => {
    expect(setUserToken('accessToken')('olo2552', jwtPattern, tokenExpiryDatePattern))
      .toBe(accessTokenSuccessMessage);
  });

  it('should save Hash when given accessToken', () => {
    setUserToken('accessToken')(usernamePattern, jwtPattern, tokenExpiryDatePattern);

    expect.assertions(1);
    return expect(mockRedis.type(`access_tokens.${usernamePattern}`))
      .resolves.toBe('hash');
  });

  it('should save string when given refreshToken', () => {
    setUserToken('refreshToken')(usernamePattern, jwtPattern);

    expect.assertions(1);
    return expect(mockRedis.type(`refresh_token.${usernamePattern}`))
      .resolves.toBe('string');
  });

  it('should reject incorrect expiryDate for access token', () => {
    expect(() => setUserToken('accessToken')(usernamePattern, jwtPattern, Date.now() - 10000))
      .toThrowError();
  });

  it('should save correct data', () => {
    setUserToken('refreshToken')(usernamePattern, jwtPattern);
    setUserToken('accessToken')(usernamePattern, jwtPattern, tokenExpiryDatePattern);

    expect.assertions(2);

    expect(mockRedis.hget(`access_tokens.${usernamePattern}`, jwtPattern))
      .resolves.toBe(tokenExpiryDatePattern);

    return expect(mockRedis.get(`refresh_token.${usernamePattern}`))
      .resolves.toBe(jwtPattern);
  });
});
