'use strict';

global.assert = require('chai').assert;
global.expect = require('chai').expect;

global.rekuire = require('../lib/rekuire');

// Sets up server and MongoDB connection
var app = require('../server');

/**
 * Seed database
 */
var User = rekuire.model('user');

// Remove all users
User.remove().exec();

// Create test user
var user = new User({
    name: 'Full name',
    email: 'test@test.com',
    token: '12345',
    username: 'user',
    password: 'password'
});
user.save();

/**
 * Global before and after
 */
before(function () {
    this.timeout(500);
});

after(function (done) {
    var server = app.get('server');
    server.close();
    done();
});

/**
 * Test helpers
 */
var request = require('superagent');
var _ = require('underscore');

// Avoid repeat for sending token by creating helper
request.Request.prototype.sendWithToken = function (data) {
    data = data || {};
    var merged = _.extend(data, {access_token: user.token});
    return this.send(merged);
};

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

var login = function (credentials, cb) {
    credentials = credentials || {username: 'user', password: 'password'};
    var agent = request.agent();
    agent.post(config.url + '/v0/session')
        .send(credentials)
        .end(function (err, res) {
            cb({
                agent: agent,
                sessionId: extractSessionId(res)
            });
        });
};

var io = require('socket.io-client');
var loginAndConnect = function (credentials, cb) {
    credentials = credentials || {username: 'user', password: 'password'};
    login(credentials, function (data) {
        var options = _.extend({}, config.ioClient, {query: 'session_id=' + data.sessionId});
        var socket = io.connect(config.url, options);

        data = _.extend(data, {socket: socket});
        socket.on('connect', function () {
            cb(data);
        });
    });
};

/**
 * Expose
 */
exports.user = user;
exports.url = config.url;
exports.login = login;
exports.loginAndConnect = loginAndConnect;