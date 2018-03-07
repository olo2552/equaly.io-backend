const Joi = require('joi');

const milisecsInWeekPeriod = 604800000;
module.exports = Joi
  .date()
  .min(Date.now())
  .max(Date.now() + milisecsInWeekPeriod)
  .timestamp('javascript')
  .required();
