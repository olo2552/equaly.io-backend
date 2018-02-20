require('dotenv').config();

const Redis = require('ioredis');

const redis = Redis({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
});

module.exports = redis;
