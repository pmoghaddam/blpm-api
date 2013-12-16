'use strict';

var socketio = require('socket.io');

module.exports = function(app, server) {
    var io = socketio.listen(server);

    io.sockets.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });
};
