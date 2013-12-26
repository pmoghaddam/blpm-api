'use strict';

var Task = rekuire.model('task');
var _ = require('underscore');
var Q = require('q');

var mergeWithDefaults = function (data) {
    return _.extend({}, data, {
        title: 'Task'
    });
}

exports.createTasks = function (data) {
    var deferred = Q.defer();

    var dataWithDefaults = _.map(data, mergeWithDefaults);

    Task.create(dataWithDefaults, function (err) {
        if (err) {
            deferred.reject(err);
        } else {
            // Tasks must (unfortunately) be retrieved from arguments
            var tasks = [];
            for (var i = 1; i < arguments.length; ++i) {
                tasks.push(arguments[i]);
            }

            deferred.resolve(tasks);
        }
    });

    return deferred.promise;
};

exports.createTask = function (data) {
    var deferred = Q.defer();

    var dataWithDefaults = mergeWithDefaults(data);

    Task.create(dataWithDefaults, function (err, task) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(task);
        }
    });

    return deferred.promise;
};