'use strict';

var config = require('./config');
var routes = require(config.appPath + '/controllers');
var user = require(config.appPath + '/controllers/user');

module.exports = function(app) {
    app.get('/', routes.index);
    app.get('/users', user.list);
};