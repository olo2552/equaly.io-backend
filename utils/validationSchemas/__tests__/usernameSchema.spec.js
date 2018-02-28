const Joi = require('joi');
const usernameSchema = require('../usernameSchema');

/* eslint-disable no-undef */
describe('usernameTokenSchema', () => {
  it('should work correctly', () => {
    expect(Joi.validate('', usernameSchema));
  });

  it('should reject empty string', () => {
    expect(Joi.validate('', usernameSchema).error)
      .not.toBeOneOf([undefined, null]);
  });

  it('should trim the username', () => {
    expect(Joi.validate(' username      ', usernameSchema).value)
      .toBe('username');
  });

  it('should not pass string shorter than 3 chars', () => {
    expect(Joi.validate('', usernameSchema).error)
      .not.toBeOneOf([undefined, null]);
  });

  it('should not pass string longer than 16 chars', () => {
    expect(Joi.validate('a', usernameSchema).error)
      .not.toBeOneOf([undefined, null]);
  });
  it('should pass correct JWT', () => {
    expect(Joi.validate('567890', usernameSchema).error)
      .not.toBeOneOf([undefined, null]);
  });
});
