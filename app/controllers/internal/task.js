'use strict';

/**
 * @Deprecated - cross-application event-handling
 * caused confusion with workflow and prevented flexibility
 * in certain causes, e.g. preventing any distinction between
 * various model events (e.g. save).
 */

var socket = rekuire.lib('socket');

exports.create = function (data) {
    socket.emitToAll('tasks:create', data);
};

exports.delete = function (data) {
    socket.emitToAll('tasks:delete', data);
};