'use strict';

var taskService = rekuire.service('task');

var user = function (socket) {
    return socket.handshake.user;
};

/**
 * Two-way message
 */
exports.list = function (data, done) {
    var taskList = (data) ? data.taskList : undefined;
    taskService
        .list(user(this), taskList)
        .then(function (tasks) {
            var tasksLean = tasks.map(function (task) {
                return task.toObject();
            });
            done(tasksLean);
        }).done();
};

exports.show = function (data, done) {
    taskService
        .show(data.id, user(this))
        .then(function (task) {
            done(task.toObject());
        }).done();
};

/**
 * One-way message
 */
exports.create = function (data) {
    taskService.create(data, user(this)).done();
};

exports.delete = function (data) {
    taskService.delete(data.id, user(this)).done();
};

exports.update = function (data) {
    taskService.update(data.id, data, user(this)).done();
};