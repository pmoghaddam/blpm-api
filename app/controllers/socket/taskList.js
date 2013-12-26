'use strict';

var taskListService = rekuire.service('taskList');
var userService = rekuire.service('user');

var user = function (socket) {
    return socket.handshake.user;
};

/**
 * Two-way message
 */
exports.list = function (data, done) {
    taskListService
        .list(user(this))
        .then(function (taskLists) {
            var tasksLean = taskLists.map(function (item) {
                return item.toObject();
            });
            done(tasksLean);
        });
};

exports.show = function (data, done) {
    taskListService
        .show(data.id, user(this))
        .then(function (item) {
            done(item.toObject());
        });
};

/**
 * One-way message
 */
exports.create = function (data) {
    taskListService.create(data, user(this));
};

exports.delete = function (data) {
    taskListService.delete(data.id, user(this));
};

exports.update = function (data) {
    taskListService.update(data.id, data, user(this));
};

exports.addCollaborator = function (data) {
    userService.get(data.user)
        .then(function (user) {
            taskListService.addCollaborator(data.id, user, data.access);
        });
};

exports.removeCollaborator = function (data) {
    userService.get(data.user)
        .then(function (user) {
            taskListService.removeCollaborator(data.id, user);
        });
};