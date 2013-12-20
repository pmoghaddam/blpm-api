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
        key: 'express.sid', // TODO: Isolate key; duplicate of express.js
        secret: '6d7b84cf448d',    // TODO: Isolate key; duplicate of express.js
        store: sessionStore
    }));

    return io;
};
