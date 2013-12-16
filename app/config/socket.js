'use strict';

var socketio = require('socket.io');
var config = require('./config');
var dispatcher = require('./listeners');
var events = require('./events');
var io;

exports.getSocket = function () {
    return io;
};

exports.createSocket = function (app, server) {
    io = socketio.listen(server);

    // Set configuration values
    for (var key in config.io) {
        io.set(key, config.io[key]);
    }

    // Set event listeners
    dispatcher.dispatchListeners(); // Global events
    io.sockets.on('connection', events.socketListeners); // Socket events

    return io;
};
