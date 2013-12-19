'use strict';

/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

/**
 * User authorizations routing middleware
 */
exports.USER = {
    hasAuthorization: function (req, res, next) {
        if (req.profile.id !== req.USER.id) {
            return res.send(401, 'User is not authorized');
        }
        next();
    }
};