'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var config = require('./config/config');
var mongoose = require('mongoose');
var http = require('http');

var app = express();

// Set server
var server = http.createServer(app);

// Configure express
require('./config/express')(app);

// Configure socket.io
require('./config/socket')(app, server);

// Configure routes
require('./config/routes')(app);

// Bootstrap db connection
mongoose.connect(config.db, config.dbOptions);

// Start application
server.listen(config.port);
console.log('Express server listening on port ' + config.port);

// Expose app
module.exports = app;