const Joi = require('joi');
const tokenTypeSchema = require('../tokenTypeSchema');

/* eslint-disable no-undef */
describe('tokenTypeSchema', () => {
  it('should reject empty string', () => {
    expect(Joi.validate('', tokenTypeSchema).error)
      .not.toBeOneOf([null, undefined]);
  });

  it('should reject numbers', () => {
    expect(Joi.validate(1000, tokenTypeSchema).error)
      .not.toBeOneOf([null, undefined]);

    expect(Joi.validate(0, tokenTypeSchema).error)
      .not.toBeOneOf([null, undefined]);

    expect(Joi.validate(-1, tokenTypeSchema).error)
      .not.toBeOneOf([null, undefined]);
  });

  it('should reject booleans', () => {
    expect(Joi.validate(true, tokenTypeSchema).error)
      .not.toBeOneOf([null, undefined]);

    expect(Joi.validate(false, tokenTypeSchema).error)
      .not.toBeOneOf([null, undefined]);
  });

  it('should reject non camelCased strings', () => {
    expect(Joi.validate({}, tokenTypeSchema).error)
      .not.toBeOneOf([null, undefined]);
  });

  it('should reject incorrect other token type', () => {
    expect(Joi.validate('userToken', tokenTypeSchema).error)
      .not.toBeOneOf([null, undefined]);
  });

  it('should pass correct token type', () => {
    expect(Joi.validate('accessToken', tokenTypeSchema).error)
      .toBeOneOf([null, undefined]);

    expect(Joi.validate('refreshToken', tokenTypeSchema).error)
      .toBeOneOf([null, undefined]);
  });
});
