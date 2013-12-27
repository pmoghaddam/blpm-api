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
    return this.find({_id:id});
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

exports.findAllByIds = function(userIds) {
    var query = User.find().where('_id').in(userIds);
    return Q.ninvoke(query, 'exec');
};

// Alias
exports.get = exports.show;
