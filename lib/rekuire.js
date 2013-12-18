'use strict';

var path = require('path');
var root = path.join(__dirname, '..');
var app = path.join(root, 'app');

/**
 * Used to create various specialized requires
 */
var createRequire = function(path) {
    return function(resource) {
        return require(path + '/' + resource);
    };
};

/**
 * All specialized requires captured below
 */
exports.fromRoot            = createRequire(root);
exports.lib                 = createRequire(root + '/lib');

exports.fromApp             = createRequire(app);
exports.config              = createRequire(app + '/config');
exports.route               = createRequire(app + '/config/routes');
exports.model               = createRequire(app + '/models');
exports.service             = createRequire(app + '/services');
exports.controller          = createRequire(app + '/controllers');
exports.internalController  = createRequire(app + '/controllers/internal');
exports.socketController    = createRequire(app + '/controllers/socket');
exports.apiController       = createRequire(app + '/controllers/api');
