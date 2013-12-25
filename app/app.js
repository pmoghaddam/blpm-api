'use strict';

/**
 * Setup application monitoring for production only
 */
if ('production' === process.env.NODE_ENV) {
    require('newrelic');
}


/**
 * Global helper for require
 */
global.rekuire = require('../lib/rekuire');

/**
 * Module dependencies.
 */
var express = require('express');
var config = rekuire.config('config');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(express);
var http = require('http');
var passport = require('passport');

var app = express();

// Set server
var server = http.createServer(app);
app.set('server', server);

// Configure passport (security)
rekuire.config('passport')(passport);

// Bootstrap db connection
var db = mongoose.connect(config.db, config.dbOptions);
var sessionStore = new mongoStore({
    db: db.connection.db,
    collection: 'sessions'
});

// Configure express
rekuire.config('express')(app, passport, sessionStore);

// Configure socket.io
var io = rekuire.config('socket').createSocket(app, server, sessionStore);

// Configure socket listeners
rekuire.route('socket')(io);

// Configure api routes
rekuire.route('api')(app, passport);

// Configure other routes (possibly with views)
rekuire.route('routes')(app);

// Start application
server.listen(config.port);
console.log('Express server listening on port ' + config.port);

// Expose app
module.exports = app;