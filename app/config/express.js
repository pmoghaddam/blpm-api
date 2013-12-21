'use strict';

var config = require('./config');
var path = require('path');
var express = require('express');
var cors = rekuire.lib('cors');

module.exports = function (app, passport, sessionStore) {
    app.set('views', config.viewPath);
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser());

    //express/mongo session storage
    app.use(express.session({
        key: 'express.sid',
        secret: '6d7b84cf448d',
        store: sessionStore
    }));

    // Passport security
    app.use(passport.initialize());
    app.use(passport.session());

    // Cross-domain access
    app.use(cors);

    app.use(app.router);
    app.use(express.static(path.join(config.rootPath, 'public')));

    if ('development' === config.env) {
        app.use(express.errorHandler());
    }
};

