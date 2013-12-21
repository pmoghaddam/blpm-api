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

