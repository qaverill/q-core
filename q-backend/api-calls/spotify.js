const request = require('request');

module.exports = {
  refreshToken: ({ Authorization, refresh_token }) => {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { Authorization },
      form: { grant_type: 'refresh_token', refresh_token },
      json: true,
    };

    return new Promise(resolve => {
      request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          resolve(body);
        }
      });
    });
  },
};
