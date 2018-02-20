const OAuth2Strategy = require('passport-oauth2');

const {
  authorizationURL,
  tokenURL,
} = require('./steemConnectV2');

module.exports = (passport) => {
  passport.use('sc2', new OAuth2Strategy(
    {
      authorizationURL,
      tokenURL,
      clientID: process.env.SC2_CLIENT_ID,
      clientSecret: process.env.SC2_CLIENT_SECRET,
      callbackURL: '/redirect/',
    },
    (accessToken, refreshToken, profile, cb) => {
      res.send(
        `accessToken: ${accessToken}`,
        `refreshToken: ${refreshToken}`,
        `profile: ${JSON.stringify(profile)}`,
      );
      console.log(`accessToken: ${accessToken}`);
      console.log(`refreshToken: ${refreshToken}`);
      console.log(`profile: ${JSON.stringify(profile)}`);
    },
  ));
};
