const router = require('express').Router();
const passport = require('passport');

const { scope } = require('../config/steemConnectV2');

const redirectMiddleware = require('../controllers/redirectMiddleware');

router.get('/login', passport.authenticate('sc2', {
  // need to join the array with ','
  // because SC2 API separates scope by ',' and passport separates by ' '
  scope: scope.join(','),
}));

router.get(
  '/redirect',
  redirectMiddleware,
  passport.authenticate('sc2'),
);

module.exports = router;
