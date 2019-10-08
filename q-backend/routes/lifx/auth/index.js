const routes = require('express').Router();
const querystring = require('querystring');
const config = require('config').lifx;
const q_api = require('q-api');

q_api.makeGetEndpoint(routes, '/', '/lifx/login', (req, res) => {
    res.redirect(`https://cloud.lifx.com/oauth/authorize?${
        querystring.stringify({
            client_id: config.client_id,
            scope: config.scope
        })
    }`)
});

module.exports = routes;