const config = require('./config');

module.exports = {
  dateToTimestamp: date => parseInt(new Date(date).getTime() / 1000, 10),
  generateRandomString: length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  },
  oathRequestOptions: ({ url, body }) => {
    const requestOptions = {
      headers: { Authorization: `Bearer ${url.includes('spotify') ? config.spotify.access_token : config.lifx.access_token}` },
      url,
    };
    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(body);
    }
    return requestOptions;
  },
};
