'use strict';

var taskService = rekuire.service('task');

/**
 * Two-way message
 */
exports.list = function (data, respond) {
    taskService.list().then(function (tasks) {
        var tasksLean = tasks.map(function (task) {
            return task.toObject();
        });
        respond(tasksLean);
    });
};

/**
 * One-way message
 */
exports.create = function (data) {
    taskService.create(data);
};

exports.delete = function (data) {
    taskService.delete(data.id);
};