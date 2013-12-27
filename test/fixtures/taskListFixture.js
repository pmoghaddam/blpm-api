'use strict';

var TaskList = rekuire.model('taskList');
var _ = require('underscore');
var Q = require('q');

exports.createTaskList = function (data) {
    var deferred = Q.defer();

    var user = data.user;
    delete data.user;

    var defaults = {
        title: 'Task List'
    };
    var input = _.extend({}, defaults, data);

    var taskList = new TaskList(input);
    taskList.addCollaborator(user, 'owner');
    taskList.save(function (err, doc) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(doc);
        }
    });

    return deferred.promise;
};