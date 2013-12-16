'use strict';

var Task = rekuire.model('task');

/**
 * Two-way message
 */
exports.list = function (data, respond) {
    Task.all(function (err, tasks) {
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
    var task = new Task(data);
    task.save();
};