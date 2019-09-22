const fs = require('fs');
const path = require('path');
const q_logger = require('q-logger');

const tokensPath = path.join(__dirname, './../../config/tokens.json');

// TODO: reading from the tokens file every time may be way too slow...?

module.exports = {
    ...require('./config.json'),
    setTokens: (granter, access_token, refresh_token) => {
        fs.readFile(tokensPath, (err, data) => {
            if (err) throw err;
            let tokens = JSON.parse(data);
            tokens[granter].access_token = access_token;
            tokens[granter].refresh_token = refresh_token;
            fs.writeFile(tokensPath, JSON.stringify(tokens, null, 2), err => {
                if (err) throw err;
                q_logger.info(`Persisted new tokens for ${granter}`);
            });
        });
    },
    access_token: granter => {
        fs.readFile(tokensPath, (err, data) => {
            if (err) throw err;
            return JSON.parse(data)[granter].access_token;
        });
    },
    refresh_token: granter => {
        fs.readFile(tokensPath, (err, data) => {
            if (err) throw err;
            return JSON.parse(data)[granter].refresh_token;
        });
    }
};