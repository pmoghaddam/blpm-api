'use strict';

var Q = require('q');

var task = rekuire.socketController('task');
var taskList = rekuire.socketController('taskList');
var user = rekuire.socketController('user');

/**
 * Convenient listener for playback events
 */
var request = function (socket, path, fn) {
    var response = function (data) {
        socket.emit(path, data);
    };
    var request = function (data, ack) {
        // Utilize Socket.IO's inherit acknowledgement or response
        var res = (ack) ? ack : response;
        fn.apply(socket, [data, res])
            .fail(function (err) {
                // TODO: Improve error handling
                console.error(err);
            });
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
        request(socket, 'tasks:show', task.show);
        request(socket, 'tasks:update', task.update);

        request(socket, 'taskLists:list', taskList.list);
        request(socket, 'taskLists:create', taskList.create);
        request(socket, 'taskLists:delete', taskList.delete);
        request(socket, 'taskLists:show', taskList.show);
        request(socket, 'taskLists:update', taskList.update);

        request(socket, 'collaborators:create', taskList.addCollaborator);
        request(socket, 'collaborators:delete', taskList.removeCollaborator);

        request(socket, 'users:findAll', user.findAll);

        // Test end-point
        request(socket, 'ping', function (data, done) {
            return Q.fcall(function () {
                done(data);
                return data;
            });
        });
    });
};