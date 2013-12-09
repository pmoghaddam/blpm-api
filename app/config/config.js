'use strict';

var _ = require('underscore');

// Load app configuration
var defaultConfig = require('./env/all.js');
module.exports = _.extend(
    defaultConfig,
    require('./env/' + defaultConfig.env + '.js') || {});
