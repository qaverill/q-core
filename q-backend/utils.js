const config = require('./config');

const getAuthorization = url => {
  if (url.includes('spotify')) {
    return `Bearer ${config.spotify.access_token}`;
  } if (url.includes('lifx')) {
    return `Bearer ${config.lifx.access_token}`;
  }
  return null;
};

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
    const requestOptions = { url };
    const Authorization = getAuthorization(url);
    if (Authorization) {
      requestOptions.headers = { Authorization };
    }
    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(body);
    }
    return requestOptions;
  },
};
