'use strict';

var socketio = require('socket.io');
var config = require('./config');

module.exports = function (app, server) {
    var io = socketio.listen(server);

    // Set configuration values
    for (var key in config.io) {
        io.set(key, config.io[key]);
    }

    io.sockets.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });
};
