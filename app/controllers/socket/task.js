'use strict';

var taskService = rekuire.service('task');

var user = function (socket) {
    return socket.handshake.user;
};

/**
 * Two-way message
 */
exports.list = function (data, done) {
    taskService
        .list(user(this))
        .then(function (tasks) {
            var tasksLean = tasks.map(function (task) {
                return task.toObject();
            });
            done(tasksLean);
        });
};

exports.show = function (data, done) {
    taskService
        .show(data.id, user(this))
        .then(function (task) {
            done(task.toObject());
        });
};

/**
 * One-way message
 */
exports.create = function (data) {
    taskService.create(data, user(this));
};

exports.delete = function (data) {
    taskService.delete(data.id, user(this));
};

exports.update = function (data) {
    taskService.update(data.id, data, user(this));
}