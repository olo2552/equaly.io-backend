const Joi = require('joi');
const tokenSchema = require('../tokenSchema');

const jwtExample = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';

/* eslint-disable no-undef */
describe('tokenSchema', () => {
  it('should reject empty string', () => {
    expect(Joi.validate('', tokenSchema).error)
      .not.toBeOneOf([null, undefined]);
  });

  it('should reject numbers', () => {
    expect(Joi.validate(1000, tokenSchema).error)
      .not.toBeOneOf([null, undefined]);

    expect(Joi.validate(0, tokenSchema).error)
      .not.toBeOneOf([null, undefined]);

    expect(Joi.validate(-1, tokenSchema).error)
      .not.toBeOneOf([null, undefined]);
  });

  it('should reject booleans', () => {
    expect(Joi.validate(true, tokenSchema).error)
      .not.toBeOneOf([null, undefined]);

    expect(Joi.validate(false, tokenSchema).error)
      .not.toBeOneOf([null, undefined]);
  });

  it('should reject non-jwt structures', () => {
    expect(Joi.validate({}, tokenSchema).error)
      .not.toBeOneOf([null, undefined]);

    expect(Joi.validate([], tokenSchema).error)
      .not.toBeOneOf([null, undefined]);

    expect(Joi.validate(new Set(), tokenSchema).error)
      .not.toBeOneOf([null, undefined]);

    expect(Joi.validate(new Map(), tokenSchema).error)
      .not.toBeOneOf([null, undefined]);
  });

  it('should pass correct JWT', () => {
    expect(Joi.validate(jwtExample, tokenSchema).error)
      .toBeNull();
  });
});
