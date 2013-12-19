'use strict';

var taskService = rekuire.service('task');

exports.list = function (req, res) {
    taskService.list().then(function (tasks) {
        res.jsonp(tasks);
    }, function () {
        res.jsonp(404, {error: 'No tasks found'});
    });
};

exports.create = function (req, res) {
    taskService.create(req.body).then(function (task) {
        res.jsonp(task);
    }, function () {
        res.jsonp(500, {error: 'Unable to persist'});
    });
};

exports.show = function (req, res) {
    taskService.show(req.params.id).then(function (task) {
        res.jsonp(task);
    }, function () {
        res.jsonp(404, {error: 'No task found'});
    });
};

exports.update = function (req, res) {
    var id = req.params.id;
    var data = req.body;

    taskService.update(id, data).then(function (task) {
        res.jsonp(task);
    }, function () {
        res.jsonp(500, {error: 'Unable to update'});
    });
};

exports.delete = function (req, res) {
    var id = req.params.id;

    taskService.delete(id).then(function () {
        res.jsonp(200);
    }, function () {
        res.jsonp(500, {error: 'Unable to update'});
    });
};