'use strict';

global.assert = require('chai').assert;
global.expect = require('chai').expect;

global.rekuire = require('../lib/rekuire');

// Sets up server and MongoDB connection
require('../server');

/**
 * Seed database
 */
// Remove all users
var User = rekuire.model('user');
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

/**
 * Expose
 */
exports.USER = user;