'use strict';

var routes = rekuire.controller('index');

module.exports = function (app) {
    app.get('/', routes.index);
};