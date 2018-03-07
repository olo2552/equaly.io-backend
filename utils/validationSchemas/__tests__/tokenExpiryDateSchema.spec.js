const Joi = require('joi');
const tokenExpiryDateSchema = require('../tokenExpiryDateSchema');

const milisecsInWeekPeriod = 604800000;
const milisecsInFiveDaysPeriod = 4.32e+8;
/* eslint-disable no-undef */
describe('access token expiry date', () => {
  it('should reject strings not in date format', () => {
    expect(Joi.validate('', tokenExpiryDateSchema).error.message)
      .toBeTruthy();

    expect(Joi.validate('new Date()', tokenExpiryDateSchema).error.message)
      .toBeTruthy();
  });

  it('should reject dates from the past', () => {
    expect(Joi.validate(999, tokenExpiryDateSchema).error.message)
      .toBeTruthy();

    expect(Joi.validate(Date.now() - 5000, tokenExpiryDateSchema).error.message)
      .toBeTruthy();
  });

  it('should reject dates that can be older than accessToken lifespan (7 days)', () => {
    const dateAfterAWeek = Date.now() + milisecsInWeekPeriod + 1000;
    expect(Joi.validate(dateAfterAWeek, tokenExpiryDateSchema).error.message)
      .toBeTruthy();
  });

  it('should accept dates in lifespan of accessToken', () => {
    const dateAfterFiveDays = Date.now() + milisecsInFiveDaysPeriod;
    expect(Joi.validate(dateAfterFiveDays, tokenExpiryDateSchema).error)
      .toBeNull();
  });
});
