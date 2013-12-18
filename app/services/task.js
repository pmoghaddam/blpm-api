'use strict';

var Task = rekuire.model('task');
var Q = require('q');
var _ = require('underscore');
var socket = rekuire.lib('socket');

exports.create = function (data) {
    var deferred = Q.defer();

    var task = new Task(data);
    task.save(function (err) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            socket.emitToAll('tasks:create', task.toObject());
            deferred.resolve(task);
        }
    });

    return deferred.promise;
};

exports.list = function () {
    var deferred = Q.defer();

    Task.all(function (err, tasks) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve(tasks);
        }
    });

    return deferred.promise;
};

exports.show = function (id) {
    var deferred = Q.defer();

    Task.findById(id, function (err, task) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve(task);
        }
    });

    return deferred.promise;
};

exports.update = function (id, data) {
    var deferred = Q.defer();

    Task.findById(id, function (err, task) {
        task = _.extend(task, data);
        task.save(function (err) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(task);
            }
        });
    });

    return deferred.promise;
};

exports.delete = function (id) {
    var deferred = Q.defer();

    Task.remove({ _id: id }, function (err) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            socket.emitToAll('tasks:delete', {_id: id});
            deferred.resolve();
        }
    });

    return deferred.promise;
};