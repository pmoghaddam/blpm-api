'use strict';

var TaskList = rekuire.model('taskList');
var Q = require('q');
var socket = rekuire.service('socket');

var findById = function (id) {
    var deferred = Q.defer();

    TaskList.findById(id, function (err, taskList) {
        if (err) {
            deferred.reject(new Error(err));
        } else if (taskList === null) {
            deferred.reject(new Error('Unable to get task list'));
        } else {
            deferred.resolve(taskList);
        }
    });
    return deferred.promise;
};

exports.list = function (user) {
    var deferred = Q.defer();

    TaskList.find({'collaborators.user': user}, function (err, taskLists) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            deferred.resolve(taskLists);
        }
    });

    return deferred.promise;
};


exports.create = function (data, user) {
    var deferred = Q.defer();

    var taskList = new TaskList(data);
    taskList.addCollaborator(user, 'owner');
    taskList.save(function (err, doc) {
        if (err) {
            deferred.reject(new Error(err));
        } else {
            socket.emitToUser('taskLists:create', doc.toObject(), user.id);
            deferred.resolve(doc);
        }
    });

    return deferred.promise;
};

exports.update = function (id, data, user) {
    var deferred = Q.defer();

    TaskList.findOneAndUpdate({_id: id, 'collaborators.user': user}, data,
        function (err, taskList) {
            if (taskList === null) {
                deferred.reject(new Error('Unable to update task list'));
            } else if (err) {
                deferred.reject(new Error(err));
            } else {
                socket.emitToUser('taskLists:update', taskList.toObject(), user.id);
                deferred.resolve(taskList);
            }
        });

    return deferred.promise;
};

exports.show = function (id, user) {
    var deferred = Q.defer();

    TaskList.findOne({_id: id, 'collaborators.user': user},
        function (err, taskList) {
            if (err) {
                deferred.reject(new Error(err));
            } else if (taskList === null) {
                deferred.reject(new Error('Unable to get task list'));
            } else {
                deferred.resolve(taskList);
            }
        });

    return deferred.promise;
};

exports.delete = function (id, user) {
    var deferred = Q.defer();

    TaskList.findOneAndRemove({_id: id, 'collaborators.user': user},
        function (err, taskList) {
            if (err) {
                deferred.reject(new Error(err));
            } else if (taskList === null) {
                deferred.reject(new Error('Unable to remove task list'));
            } else {
                socket.emitToUser('taskLists:delete', {_id: id}, user.id);
                deferred.resolve(taskList);
            }
        });

    return deferred.promise;
};

exports.addCollaborator = function (id, user, access) {
    var deferred = Q.defer();

    findById(id).then(function (taskList) {
        taskList.addCollaborator(user, access);
        taskList.save(function (err, doc) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                socket.emitToUser('collaborator:create', doc.toObject(), user.id);
                deferred.resolve(doc);
            }
        });
    });

    return deferred.promise;
};

exports.removeCollaborator = function (id, user) {
    var deferred = Q.defer();

    findById(id).then(function (taskList) {
        taskList.removeCollaborator(user);
        taskList.save(function (err, doc) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                socket.emitToUser('collaborator:delete', {_id: id}, user.id);
                deferred.resolve(doc);
            }
        });
    });

    return deferred.promise;
};

/**
 * Important for internal management
 */
exports.get = function(id) {
    var deferred = Q.defer();

    TaskList.findById(id,
        function (err, taskList) {
            if (err) {
                deferred.reject(new Error(err));
            } else if (taskList === null) {
                deferred.reject(new Error('Unable to get task list'));
            } else {
                deferred.resolve(taskList);
            }
        });

    return deferred.promise;
};
