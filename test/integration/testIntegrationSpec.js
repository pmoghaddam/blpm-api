'use strict';

var helper = require('../testHelper');
var request = require('superagent');
var url = helper.url;
var mongoose = require('mongoose');
var dispatcher = rekuire.lib('dispatcher');
var io = require('socket.io-client');


describe('Basic integration test', function () {
    this.timeout(500);

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

    describe('authenticated', function () {

        it('should connect to Socket.IO (with authentication)', function (done) {
            var client = io.connect(url, helper.ioOptions);

            client.on('connected', function (data) {
                assert.ok(data.connected);
                client.disconnect();
                done();
            });
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


