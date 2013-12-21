'use strict';

/**
 * Extremely basic approach to receiving a token.
 * In the future, proper OAuth 2 should be setup
 */
exports.token = function (req, res) {
    res.jsonp(200, {access_token: req.user.token});
};

exports.session = function (req, res) {
    res.jsonp(200);
};