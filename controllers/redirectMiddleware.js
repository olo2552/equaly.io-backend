const axios = require('axios');

const { tokenURL } = require('../config/steemConnectV2');

function redirectMiddleware(fetch) {
  return async (req, res, next) => {
    try {
      const profileAuthData = await fetch.post(
        tokenURL,
        {},
        {
          params: {
            code: req.query.code,
            client_secret: process.env.SC2_CLIENT_SECRET,
          },
        },
      ).then(response => response.data);

        // I know, that modifying query from the server-side is
        // side-effect and considered as antipattern,
        // but it is required for passport to work
      req.query.access_token = profileAuthData.access_token;
      req.query.client_secret = process.env.SC2_CLIENT_SECRET;

      const profile = await fetch.post(
        'https://v2.steemconnect.com/api/me',
        {},
        {
          headers: {
            Authorization: req.query.access_token,
          },
        },
      ).then(response => response.data);

      res.send(profileAuthData);
    } catch (err) {
      console.log(err);
    }
    next();
  };
}

module.exports = redirectMiddleware(axios);
