'use strict';

var helper = require('../testHelper');
var request = require('superagent');
var url = helper.url;
var mongoose = require('mongoose');
var dispatcher = rekuire.lib('dispatcher');

var userFixture = require('../fixtures/userFixture');


describe('Basic Integration', function () {
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
        var socket;

        before(function (done) {
            helper.loginAndConnect({username: user.username}).then(function (data) {
                socket = data.socket;
                done();
            }).done();
        });

        after(function () {
            socket.disconnect();
        });

        it('should connect to Socket.IO (with authentication)', function () {
            assert.ok(socket);
            assert.isTrue(socket.socket.connected);
        });

        it('should acknowledge using Socket.IO acks', function (done) {
            socket.emit('ping', 'pong', function (data) {
                assert.equal(data, 'pong');
                done();
            });
        });

        it('should acknowledge using one-time events', function (done) {
            socket.once('ping', function (data) {
                assert.equal(data, 'pong');
                done();
            });
            socket.emit('ping', 'pong');
        });

        it('should not acknowledge using one-time event if Socket.IO ack is passed in', function (done) {
            socket.once('ping', function () {
                done(new Error('Unexpected event'));
            });
            socket.emit('ping', 'pong', function (data) {
                assert.equal(data, 'pong');
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


