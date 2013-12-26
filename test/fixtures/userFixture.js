'use strict';

var User = rekuire.model('user');
var _ = require('underscore');
var Q = require('q');

exports.createUser = function (data) {
    var deferred = Q.defer();

    var defaults = {
        name: 'Full name',
        email: 'test@test.com',
        token: '12345',
        username: 'user',
        password: 'password'
    };
    var input = _.extend({}, defaults, data);

    User.create(input)
        .then(function (user) {
            deferred.resolve(user);
        }, function (err) {
            deferred.reject(new Error(err));
        });

    return deferred.promise;
};

exports.createAltUser = function () {
    return this.createUser({
        name: 'Alt',
        email: 'altusertesting@email.com',
        username: 'altuser',
        password: 'password',
        token: '1828545'
    });
};