'use strict';

var config = require('./config');
var routes = require(config.appPath + '/controllers');
var user = require(config.appPath + '/controllers/user');
var task = require(config.appPath + '/controllers/task');

module.exports = function(app) {
    var version = '/v0';

    app.get(version + '/', routes.index);
    app.get(version + '/users', user.list);

    app.get(version + '/tasks', task.list);
    app.post(version + '/tasks', task.create);
    app.get(version + '/tasks/:id', task.show);
    app.put(version + '/tasks/:id', task.update);
    app.del(version + '/tasks/:id', task.delete);
};