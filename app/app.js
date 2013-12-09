'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var config = require('./config/config');
var mongoose = require('mongoose');

var app = express();

// Configure express
require('./config/express')(app);

// Bootstrap db connection
mongoose.connect(config.db);

// development only
app.get('/', routes.index);
app.get('/users', user.list);

// Start application
app.listen(config.port);
console.log('Express server listening on port ' + config.port);

// Expose app
module.exports = app;