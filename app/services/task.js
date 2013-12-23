'use strict';

var Task = rekuire.model('task');
var Q = require('q');
var socket = rekuire.service('socket');

exports.create = function (data, user) {
    var deferred = Q.defer();

    data.user = user;

    Task.create(data)
        .then(function (task) {
            socket.emitToUser('tasks:create', task.toObject(), user);
            deferred.resolve(task);
        }, function (err) {
            deferred.reject(new Error(err));
        });


    return deferred.promise;
};

exports.list = function (user) {
    var deferred = Q.defer();

    Task.find({user: user}, function (err, tasks) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve(tasks);
        }
    });

    return deferred.promise;
};

exports.show = function (id, user) {
    var deferred = Q.defer();

    Task.findOne({_id: id, user: user}, function (err, task) {
        if (err) {
            deferred.reject(new Error(err));
        } else if (task === null) {
            deferred.reject(new Error('Unauthorized task access'));
        } else {
            deferred.resolve(task);
        }
    });

    return deferred.promise;
};

exports.update = function (id, data, user) {
    var deferred = Q.defer();

    Task.findOneAndUpdate({_id: id, user: user}, data)
        .exec()
        .then(function (task) {
            if (task === null) {
                deferred.reject(new Error('Unable to update task'));
            } else {
                socket.emitToUser('tasks:update', task.toObject(), user);
                deferred.resolve(task);
            }
        }, function (err) {
            deferred.reject(new Error(err));
        });

    return deferred.promise;
};

exports.delete = function (id, user) {
    var deferred = Q.defer();

    Task.findOneAndRemove({ _id: id, user: user })
        .exec()
        .then(function (task) {
            if (task === null) {
                deferred.reject(new Error('Unable to delete task'));
            } else {
                socket.emitToUser('tasks:delete', {_id: id}, user);
                deferred.resolve(task);
            }
        }, function (err) {
            deferred.reject(new Error(err));
        });

    return deferred.promise;
};