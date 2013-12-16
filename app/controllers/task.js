'use strict';

var Task = require('../models/task');
var _ = require('underscore');

exports.list = function (req, res) {
    Task.all(function (err, tasks) {
        if (err) {
            res.jsonp(404, {error: 'No tasks found'});
        } else {
            res.jsonp(tasks);
        }
    });
};

exports.create = function (req, res) {
    var task = new Task(req.body);

    task.save(function (err) {
        if (err) {
            res.jsonp(500, {error: 'Unable to persist'});
        } else {
            res.jsonp(task);
        }
    });
};

exports.show = function (req, res) {
    var id = req.params.id;

    Task.findById(id, function (err, task) {
        if (err) {
            res.jsonp(404, {error: 'No task found'});
        } else {
            res.jsonp(task);
        }
    });
};

exports.update = function (req, res) {
    var id = req.params.id;

    Task.findById(id, function (err, task) {
        task = _.extend(task, req.body);
        task.save(function (err) {
            if (err) {
                res.jsonp(500, {error: 'Unable to update'});
            } else {
                res.jsonp(task);
            }
        });
    });
};

exports.delete = function (req, res) {
    var id = req.params.id;
    Task.remove({ _id: id }, function (err) {
        if (err) {
            res.jsonp(500, {error: 'Unable to delete'});
        } else {
            res.jsonp(200);
        }
    });
};