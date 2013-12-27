'use strict';

var User = rekuire.model('user');
var Q = require('q');

exports.create = function (data) {
    var deferred = Q.defer();

    var user = new User(data);
    user.save(function (err) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve(user);
        }
    });

    return deferred.promise;
};

exports.show = function (id) {
    var deferred = Q.defer();

    User.findById(id,
        function (err, user) {
            if (err) {
                deferred.reject(new Error(err));
            } else if (user === null) {
                deferred.reject(new Error('Unable to get task list'));
            } else {
                deferred.resolve(user);
            }
        });

    return deferred.promise;
};

exports.find = function(where) {
    var deferred = Q.defer();

    User.findOne(where, function(err, res) {
        if (err) {
            deferred.reject(new Error(err));
        } else if (!res) {
            deferred.reject(new Error('User not found'));
        } else {
            deferred.resolve(res);
        }
    });

    return deferred.promise;
};

// Alias
exports.get = exports.show;
