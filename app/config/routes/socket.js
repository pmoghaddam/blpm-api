'use strict';

var task = rekuire.socketController('task');

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

module.exports = function (io) {
    // Set event listeners
    io.sockets.on('connection', function (socket) {
        socket.emit('connected', {connected: true});

        // Request events
        request(socket, 'tasks:list', task.list);
        request(socket, 'tasks:create', task.create);
        request(socket, 'tasks:delete', task.delete);
    });
};