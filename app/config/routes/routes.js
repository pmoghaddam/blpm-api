'use strict';

var routes = rekuire.controller('index');
var user = rekuire.controller('user');

module.exports = function (app) {
    app.get('/', routes.index);
    app.get('/users', user.list);
};