module.exports = {
  authorizationURL: 'https://v2.steemconnect.com/oauth2/authorize',
  tokenURL: 'https://v2.steemconnect.com/api/oauth2/token',
  scope: [
    'login',
    'offline',
    'vote',
    'comment',
    'comment_delete',
    'comment_options',
    'custom_json',
  ],
};
