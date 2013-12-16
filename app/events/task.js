'use strict';

var Task = require('../models/task');

exports.list = function (data, done) {
    Task.all(function (err, tasks) {
        var tasksLean = tasks.map(function (task) {
            return task.toObject();
        });
        done(tasksLean);
    });
};
