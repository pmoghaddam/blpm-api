'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var config = require('./config/config');
var mongoose = require('mongoose');

var app = express();

// Configure express
require('./config/express')(app);

// Configure routes
require('./config/routes')(app);

// Bootstrap db connection
mongoose.connect(config.db);

// Start application
app.listen(config.port);
console.log('Express server listening on port ' + config.port);

// Expose app
module.exports = app;