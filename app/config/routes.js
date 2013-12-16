'use strict';

var config = require('./config');
var routes = require(config.appPath + '/controllers');
var user = require(config.appPath + '/controllers/user');
var task = require(config.appPath + '/controllers/task');

module.exports = function(app) {
    app.get('/', routes.index);
    app.get('/users', user.list);
    app.get('/tasks', task.list);
    app.post('/tasks', task.create);
    app.get('/tasks/:id', task.show);
    app.put('/tasks/:id', task.update);
    app.del('/tasks/:id', task.delete);
};