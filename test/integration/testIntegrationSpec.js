'use strict';

require('../testHelper');

var request = require('request');
var url = 'http://localhost:' + 5001;
var mongoose = require('mongoose');
var dispatcher = rekuire.lib('dispatcher');
var io = require('socket.io-client');
var options = {
    transports: ['websocket'],
    'force new connection': true
};

describe('Basic integration test', function () {
    // TODO: Test is broken, response is actually 404, fix this
    it('should contact server', function (done) {
        request(url, function (error, response) {
            assert.ok(response);
            done();
        });
    });

    it('should connect to MongoDb', function (done) {
        var db = mongoose.connection;
        db.once('error', function (err) {
            throw new Error('Error: ' + err.err);
        });
        db.once('open', function () {
            done();
        });

        if (db.readyState === 1) {
            done();
        }
        if (db.readyState === 0) {
            throw new Error('Disconnected MongoDB connection');
        }
    });

    it('should connect to Socket.IO', function (done) {
        var client = io.connect(url, options);

        client.on('connected', function (data) {
            assert.ok(data.connected);
            client.disconnect();
            done();
        });
    });

    it('should connect to application event dispatcher', function (done) {
        var fn = function () {
            dispatcher.removeListener('test', fn);
            done();
        };
        dispatcher.on('test', fn);
        dispatcher.emit('test');
    });
});


