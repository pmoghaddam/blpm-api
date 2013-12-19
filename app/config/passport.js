'use strict';

var User = rekuire.model('user');
var BearerStrategy = require('passport-http-bearer').Strategy;

module.exports = function (passport) {

    //Use OAuth 2.0 for API authentication
    passport.use(new BearerStrategy(
        function (token, done) {
            User.findOne({
                token: token
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                return done(null, user);
            });
        }
    ));
};