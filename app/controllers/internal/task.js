'use strict';

var socket = rekuire.lib('socket');

exports.create = function (data) {
    socket.emitToAll('tasks:create', data);
};

exports.delete = function (data) {
    socket.emitToAll('tasks:delete', data);
};