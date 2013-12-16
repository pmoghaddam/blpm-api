'use strict';

/**
 * Global helper for require
 */
global.rekuire = require('../lib/rekuire');

/**
 * Module dependencies.
 */
var express = require('express');
var config = rekuire.fromApp('config/config');
var mongoose = require('mongoose');
var http = require('http');

var app = express();

// Set server
var server = http.createServer(app);

// Configure express
rekuire.config('express')(app);

// Configure socket.io
rekuire.config('socket').createSocket(app, server);

// Configure routes
rekuire.config('routes')(app);

// Bootstrap db connection
mongoose.connect(config.db, config.dbOptions);

// Start application
server.listen(config.port);
console.log('Express server listening on port ' + config.port);

// Expose app
module.exports = app;