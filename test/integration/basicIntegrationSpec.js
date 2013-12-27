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
        it('should connect to Socket.IO (with authentication)', function (done) {
            helper.loginAndConnect({username: user.username}).then(function (data) {
                var socket = data.socket;
                assert.ok(socket);
                assert.isTrue(socket.socket.connected);
                socket.disconnect();
                done();
            }).done();
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


