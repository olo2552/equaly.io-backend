require('dotenv').config();

const Redis = require('ioredis');

const mockRedis = new Redis({
  host: process.env.DB_MOCK_HOST,
  port: process.env.DB_MOCK_PORT,
});

const { checkUserTokenFactory } = require('../isUserTokenInDB');

const checkUserToken = checkUserTokenFactory(mockRedis);

/* eslint-disable no-undef */
describe('checkUserToken', () => {
  const jwtPattern = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
  const usernamePattern = 'olo2552';

  beforeEach(() => {
    mockRedis.hset(`access_tokens.${usernamePattern}`, jwtPattern, Date.now() + 340000000);
    mockRedis.set(`refresh_token.${usernamePattern}`, jwtPattern);
  });

  afterEach(() => {
    mockRedis.flushall();
  });

  it('should work without crashing', () => {
    expect(checkUserToken('accessToken')(usernamePattern, jwtPattern));
    expect(checkUserToken('refreshToken')(usernamePattern, jwtPattern));
  });

  it('should throw an error when provided incorrect tokenType', () => {
    expect.assertions(1);
    return expect(checkUserToken('')(usernamePattern, jwtPattern))
      .rejects.toThrowError();
  });

  it('should throw an error when provided incorrect username', () => {
    expect.assertions(1);
    return expect(checkUserToken('accessToken')('', jwtPattern))
      .rejects.toThrowError();
  });

  it('should throw an error when provided incorrect token', () => {
    expect.assertions(1);

    return expect(checkUserToken('accessToken')(usernamePattern, 'dsafdsfa.....@%$!$'))
      .rejects.toThrowError();
  });

  it('should resolve false, when user token is not in DB', () => {
    expect.assertions(2);

    expect(checkUserToken('refreshToken')(usernamePattern, `${jwtPattern}adfdsf`))
      .resolves.toBe(false);

    return expect(checkUserToken('accessToken')(usernamePattern, `${jwtPattern}adfdsf`))
      .resolves.toBe(false);
  });

  it('should resovle true, when user token appears in DB', () => {
    expect.assertions(2);

    expect(checkUserToken('accessToken')(usernamePattern, jwtPattern))
      .resolves.toBe(true);

    return expect(checkUserToken('refreshToken')(usernamePattern, jwtPattern))
      .resolves.toBe(true);
  });
});
