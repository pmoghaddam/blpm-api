'use strict';

global.assert = require('chai').assert;
global.expect = require('chai').expect;

global.rekuire = require('../lib/rekuire');

// Sets up server and MongoDB connection
require('../server');

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

// Read session ID from agent
var cookie = require('express/node_modules/cookie'),
    parseSignedCookie = require('express/node_modules/connect').utils.parseSignedCookie;

var agent = request.agent();
agent.post('http://localhost:5001/v0/session')
    .send({username: 'user', password: 'password'})
    .end(function (err, res) {

        var cookies = cookie.parse(res.headers['set-cookie'][0]);
        var signed = cookies['express.sid']; // TODO: Utilize config

        var sessionId = parseSignedCookie(signed, '6d7b84cf448d'); // TODO: Utilize config

        // Update exports
        exports.sessionId = sessionId;
        exports.ioOptions.query = 'session_id=' + sessionId;
    });

/**
 * Expose
 */
exports.url = 'http://localhost:' + 5001;
exports.authorizedAgent = agent;
exports.ioOptions = {
    transports: ['websocket'],
    'force new connection': true
};