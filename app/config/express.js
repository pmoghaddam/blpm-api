'use strict';

var config = require('./config');
var path = require('path');
var express = require('express');

module.exports = function (app, passport) {
    app.set('views', config.viewPath);
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser('15f84b6a80174b6769025b'));

    // Passport security
    app.use(passport.initialize());

    app.use(app.router);
    app.use(express.static(path.join(config.rootPath, 'public')));

    if ('development' === config.env) {
        app.use(express.errorHandler());
    }
};

