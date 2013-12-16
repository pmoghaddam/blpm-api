'use strict';

var path = require('path');
var root = path.join(__dirname, '..');
var app = path.join(root, 'app');
var config = path.join(app, 'config');

exports.fromRoot = function (resource) {
    return require(root + '/' + resource);
};

exports.fromApp = function (resource) {
    return require(app + '/' + resource);
};

exports.config = function (resource) {
    return require(config + '/' + resource);
};

exports.model = function (resource) {
    return require(app + '/models/' + resource);
};

exports.controller = function (resource) {
    return require(app + '/controllers/' + resource);
};

exports.lib = function (resource) {
    return require(root + '/lib/' + resource);
};

exports.listener = function (resource) {
    return require(app + '/listeners/' + resource);
};

exports.message = function (resource) {
    return require(app + '/messages/' + resource);
};