'use strict';

var taskListService = rekuire.service('taskList');
var userService = rekuire.service('user');
var _ = require('underscore');

var user = function (socket) {
    return socket.handshake.user;
};

var lean = function(items) {
    return _.map(items, function (item) {
        return item.toObject();
    });
};

/**
 * Two-way message
 */
exports.list = function (data, done) {
    return taskListService
        .list(user(this))
        .then(function (taskLists) {
            var tasksLean = lean(taskLists);
            done(tasksLean);
        });
};

exports.show = function (data, done) {
    return taskListService
        .show(data.id, user(this))
        .then(function (item) {
            done(item.toObject());
        });
};

/**
 * One-way message
 */
exports.create = function (data) {
    return taskListService.create(data, user(this));
};

exports.delete = function (data) {
    return taskListService.delete(data.id, user(this));
};

exports.update = function (data) {
    return taskListService.update(data.id, data, user(this));
};

exports.addCollaborator = function (data) {
    return taskListService.addCollaboratorViaEmail(data.id, data.email, data.access, user(this));
};

exports.removeCollaborator = function (data) {
    var requestingUser = user(this);
    return userService.get(data.user)
        .then(function (res) {
            taskListService.removeCollaborator(data.id, res, requestingUser);
        });
};