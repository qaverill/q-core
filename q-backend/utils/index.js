const config = require('../config');
// ----------------------------------
// HELPERS
// ----------------------------------
const getAuthorization = url => {
  const { spotify, lifx } = config;
  if (url.includes('token')) {
    return `Basic ${Buffer.from(`${spotify.client_id}:${spotify.client_secret}`).toString('base64')}`;
  } if (url.includes('spotify')) {
    return `Bearer ${spotify.access_token}`;
  } if (url.includes('lifx')) {
    return `Bearer ${lifx.access_token}`;
  }
  return null;
};
// ----------------------------------
// EXPROTS
// ----------------------------------
module.exports = {
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
      requestOptions.body = body;
      requestOptions.json = true;
    }
    if (url.includes('token')) {
      const { refresh_token } = config.spotify;
      requestOptions.form = { grant_type: 'refresh_token', refresh_token };
    }
    return requestOptions;
  },
  roundNumber2Decimals: num => +((num).toFixed(2)),
  getMinTimestamp: objectsWithTimestampProp => Math.min(...objectsWithTimestampProp.map(item => item.timestamp)), // ramda me
};
