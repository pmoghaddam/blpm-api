'use strict';

var _ = require('underscore');

// Default env
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Load app configuration
var defaultConfig = require('./env/all.js');
module.exports = _.extend(
    defaultConfig,
    require('./env/' + defaultConfig.env + '.js') || {});
