'use strict';

var Task = rekuire.model('task');
var Q = require('q');
var socket = rekuire.service('socket');

var taskListService = rekuire.service('taskList');

var notifyCollaborators = function (event, data, taskListId) {
    taskListService.get(taskListId)
        .then(function (taskList) {
            socket.emitToUsers(event, data, taskList.users());
        });
};

exports.create = function (data, user) {
    var deferred = Q.defer();

    data.user = user;

    Task.create(data)
        .then(function (task) {
            notifyCollaborators('tasks:create', task.toObject(), task.taskList);
            deferred.resolve(task);
        }, function (err) {
            deferred.reject(new Error(err));
        });


    return deferred.promise;
};

exports.list = function (user, taskList) {
    var deferred = Q.defer();

    var query = Task.find({user: user, taskList: taskList});
    query.exec(function (err, tasks) {
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
                notifyCollaborators('tasks:update', task.toObject(), task.taskList);
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
                notifyCollaborators('tasks:delete', {_id: id}, task.taskList);
                deferred.resolve(task);
            }
        }, function (err) {
            deferred.reject(new Error(err));
        });

    return deferred.promise;
};