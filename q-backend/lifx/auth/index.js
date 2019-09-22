const routes = require('express').Router();
const querystring = require('querystring');
const config = require('config').lifx;
const request = require('request');

routes.get('/login', (req, res) => {
    res.redirect(`https://cloud.lifx.com/oauth/authorize?${
        querystring.stringify({
            client_id: config.client_id,
            scope: config.scope
        })
    }`)
});

module.exports = routes;