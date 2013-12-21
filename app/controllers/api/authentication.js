'use strict';

var userService = rekuire.service('user');

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

exports.registration = function(req, res) {
    userService.create(req.body).then(function (user) {
        res.jsonp(user);
    }, function () {
        res.jsonp(500, {error: 'Unable to persist'});
    });
};