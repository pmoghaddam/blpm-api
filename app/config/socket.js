'use strict';

var socketio = require('socket.io');
var config = require('./config');
var io;

exports.getSocket = function () {
    return io;
};

exports.createSocket = function (app, server) {
    io = socketio.listen(server, config.io);
    return io;
};
