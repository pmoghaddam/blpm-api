'use strict';

global.assert = require('chai').assert;
global.expect = require('chai').expect;

global.rekuire = require('../lib/rekuire');

var request = require('superagent');
var _ = require('underscore');
var Q = require('q');

// Sets up server and MongoDB connection
var app = require('../server');

// Models
var User = rekuire.model('user');

/**
 * Global before and after
 */
before(function (done) {
    User.remove().exec(done);
    // Add global before logic here
});

after(function (done) {
    var server = app.get('server');
    server.close(function () {
        done();
    });
});

/**
 * Test helpers
 */
var config = rekuire.config('config');

// Read session ID from agent (required by Socket.IO)
var extractSessionId = function (res) {
    var cookie = require('express/node_modules/cookie');
    var parseSignedCookie = require('express/node_modules/connect').utils.parseSignedCookie;

    var cookies = cookie.parse(res.headers['set-cookie'][0]);
    var signed = cookies[config.sessionKey];

    var sessionId = parseSignedCookie(signed, config.sessionSecret);
    return sessionId;
};

var login = function (credentials) {
    var defer = Q.defer();

    credentials = _.extend({username: 'user', password: 'password'}, credentials);
    var agent = request.agent();
    agent.post(config.url + '/v0/session')
        .send(credentials)
        .end(function (err, res) {
            if (err) {
                defer.reject(new Error(err));
            } else {
                defer.resolve({
                    agent: agent,
                    sessionId: extractSessionId(res)
                });
            }
        });

    return defer.promise;
};

var io = require('socket.io-client');
var loginAndConnect = function (credentials) {
    var defer = Q.defer();

    login(credentials).then(function (data) {
        var options = _.extend({}, config.ioClient, {query: 'session_id=' + data.sessionId});
        var socket = io.connect(config.url, options);

        data = _.extend(data, {socket: socket});
        socket.on('connect', function () {
            defer.resolve(data);
        });
        socket.on('error', function () {
            defer.reject(new Error('Socket error'));
        });
    }).done();

    return defer.promise;
};

/**
 * Expose
 */
exports.url = config.url;
exports.login = login;
exports.loginAndConnect = loginAndConnect;