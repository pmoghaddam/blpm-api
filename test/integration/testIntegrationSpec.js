'use strict';

var request = require('request');
var url = 'http://localhost:' + 5001;
var mongoose = require('mongoose');
var io = require('socket.io-client');
var options = {
    transports: ['websocket'],
    'force new connection': true
};

describe('Basic integration test', function () {
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

        client.on('news', function (data) {
            assert(data.hello === 'world');
            done();
            client.disconnect();
        });
    });
});


