const routes = require('express').Router();
const querystring = require('querystring');
const config = require('config').lifx;
const { q_api, q_utils } = require('q-lib');

q_api.makeGetEndpoint(routes, '/', '/lifx/login', (req, res) => {
    res.redirect(`https://cloud.lifx.com/oauth/authorize?${
        querystring.stringify({
            client_id: config.client_id,
            scope: config.scope,
            state: q_utils.generateRandomString(16),
            response_type: 'code',
            redirect_uri
        })
    }`)
});

module.exports = routes;