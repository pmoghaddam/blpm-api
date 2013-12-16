'use strict';

var task = require('../events/task');

/**
 * Convenient listener for playback events
 */
var request = function (socket, path, fn) {
    var response = function (data) {
        socket.emit(path, data);
    };
    var request = function (data) {
        fn.apply(socket, [data, response]);
    };
    socket.on(path, request);
};

// Sets up appropriate listeners for socket
module.exports = function (socket) {
    socket.emit('connected', {connected: true});

    // Request events
    request(socket, 'v0/tasks/list', task.list);

};