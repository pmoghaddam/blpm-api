'use strict';

/**
 * @Deprecated - cross-application event-handling
 * caused confusion with workflow and prevented flexibility
 * in certain causes, e.g. preventing any distinction between
 * various model events (e.g. save).
 */

var EventEmitter = require('events').EventEmitter;

module.exports = new EventEmitter();