'use strict';

var Task = rekuire.model('task');
var socket = rekuire.config('socket');

exports.list = function (data, done) {
    Task.all(function (err, tasks) {
        var tasksLean = tasks.map(function (task) {
            return task.toObject();
        });
        done(tasksLean);
    });
};

exports.create = function (data) {
    var io = socket.getSocket();

    var clients = io.sockets.clients();
    for (var i = 0; i < clients.length; i++) {
        clients[i].emit('tasks:create', data);
    }
};