'use strict';

var socketio = require('socket.io');
var config = require('./config');
var express = require('express');
var passportSocketIo = require('passport.socketio');
var io;

exports.getSocket = function () {
    return io;
};

exports.createSocket = function (app, server, sessionStore) {
    io = socketio.listen(server, config.io);

    // Set authorization for socket.io
    io.set('authorization', passportSocketIo.authorize({
        cookieParser: express.cookieParser,
        key: config.sessionKey,
        secret: config.sessionSecret,
        store: sessionStore
    }));

    return io;
};
