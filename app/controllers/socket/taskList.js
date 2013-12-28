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
    taskListService
        .list(user(this))
        .then(function (taskLists) {
            var tasksLean = lean(taskLists);
            done(tasksLean);
        }).done();
};

exports.show = function (data, done) {
    taskListService
        .show(data.id, user(this))
        .then(function (item) {
            done(item.toObject());
        }).done();
};

/**
 * One-way message
 */
exports.create = function (data) {
    taskListService.create(data, user(this)).done();
};

exports.delete = function (data) {
    taskListService.delete(data.id, user(this)).done();
};

exports.update = function (data) {
    taskListService.update(data.id, data, user(this)).done();
};

exports.addCollaborator = function (data) {
    taskListService.addCollaboratorViaEmail(data.id, data.email, data.access, user(this));
};

exports.removeCollaborator = function (data) {
    var requestingUser = user(this);
    userService.get(data.user)
        .then(function (res) {
            taskListService.removeCollaborator(data.id, res, requestingUser);
        }).done();
};