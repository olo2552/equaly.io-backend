const joiValidate = require('../joiValidate');
const usernameSchema = require('../validationSchemas/usernameSchema');
const tokenTypeSchema = require('../validationSchemas/tokenTypeSchema');

const usernameExample = 'olo2552';
const tokenTypeExample = 'accessToken';

/* eslint-disable no-undef */
describe('joiValidate', () => {
  it('should work without crashing', () => {
    expect(joiValidate(usernameExample, usernameSchema));
  });

  it('should should return true, when given correct data', () => {
    expect(joiValidate(usernameExample, usernameSchema))
      .toBe(true);
  });

  it('should return false when given incorrect data', () => {
    expect(joiValidate('dasf&*^%*&{{{{...adfa', usernameSchema))
      .toBe(false);
  });

  it('should work for multiple schemas', () => {
    expect(joiValidate([
      [usernameExample, usernameSchema],
      [tokenTypeExample, tokenTypeSchema],
    ]));
  });

  it('should return true when given correct multiple schemas', () => {
    expect(joiValidate([
      [usernameExample, usernameSchema],
      [tokenTypeExample, tokenTypeSchema],
    ])).toBe(true);
  });

  it('should return true when given correct schema', () => {
    expect(joiValidate([
      [usernameExample, usernameSchema],
    ])).toBe(true);
  });

  it('should return false when given incorrect multiple schemas', () => {
    expect(joiValidate([
      ['][324134--/', usernameSchema],
      ['alkshfd&(1497{};', tokenTypeSchema],
    ])).toBe(false);

    expect(joiValidate([
      [usernameExample, usernameSchema],
      ['alkshfd&(1497{};', tokenTypeSchema],
    ])).toBe(false);

    expect(joiValidate([
      ['adsfasdf*(&^(*%', usernameSchema],
      [tokenTypeExample, tokenTypeSchema],
    ])).toBe(false);
  });
});
