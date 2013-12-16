'use strict';

var socketio = require('socket.io');
var config = require('./config');

module.exports = function (app, server) {
    var io = socketio.listen(server);

    // Set configuration values
    for (var key in config.io) {
        io.set(key, config.io[key]);
    }

    // Set event listeners
    io.sockets.on('connection', require('./events'));
};
