'use strict';

var config = rekuire.config('socket');

exports.getIO = function() {
    return config.getSocket();
};

exports.getSocket = function() {
    return config.getSocket().getSocket();
};

exports.emitToAll = function(event, data) {
    var io = this.getIO();

    var clients = io.sockets.clients();
    for (var i = 0; i < clients.length; i++) {
        clients[i].emit(event, data);
    }
};

