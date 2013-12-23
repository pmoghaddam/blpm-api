'use strict';

var config = rekuire.config('socket');
var _ = require('underscore');

// TODO: Improve logic on finding all sockets based on a user
// OPTIMIZE: Create a hash
var getSocketsOfUser = function (user) {
    var io = config.getSocket();
    var clients = io.sockets.clients();

    var sockets = _.filter(clients, function (client) {
        return client.handshake.user.id === user.id;
    });
    return sockets;
};

exports.emitToUser = function (event, data, user) {
    var sockets = getSocketsOfUser(user);
    for (var i = 0; i < sockets.length; i++) {
        sockets[i].emit(event, data);
    }
};


