'use strict';

var helper = require('../testHelper');
var request = require('superagent');
var _ = require('underscore');
var config = rekuire.config('config');
var url = helper.url;
var mongoose = require('mongoose');
var dispatcher = rekuire.lib('dispatcher');
var io = require('socket.io-client');

var userFixture = require('../fixtures/userFixture');


describe('Basic integration test', function () {
    this.timeout(500);

    var user;

    before(function (done) {
        userFixture.createUser()
            .then(function (res) {
                user = res;
                done();
            }).done();
    });

    after(function (done) {
        user.remove(done);
    });

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
            helper.login({username: user.username, password: 'password'}, function (data) {
                var options = _.extend({}, config.ioClient, {query: 'session_id=' + data.sessionId});
                var socket = io.connect(config.url, options);

                socket.on('connected', function (data) {
                    assert.ok(data.connected);
                    socket.disconnect();
                    done();
                });
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


