'use strict';

var config = rekuire.config('socket');
var _ = require('underscore');

// TODO: Improve logic on finding all sockets based on a user
// OPTIMIZE: Create a hash
var getSocketsOfUser = function (userId) {
    var io = config.getSocket();
    var clients = io.sockets.clients();

    var sockets = _.filter(clients, function (client) {
        return client.handshake.user.id === userId.toString();
    });
    return sockets;
};

exports.emitToUser = function (event, data, userId) {
    var sockets = getSocketsOfUser(userId);
    for (var i = 0; i < sockets.length; i++) {
        sockets[i].emit(event, data);
    }
};

// OPTIMIZE: Is this logic better or focusing a taskList to exist?
exports.emitToCollaborators = function (event, data, task) {
    var users;
    var taskList = task.taskList;

    if (taskList) {
        users = _.map(taskList.collaborators, function (item) {
            return item.user;
        });
    } else {
        users = [task.user];
    }

    var me = this;
    users.forEach(function (item) {
        me.emitToUser(event, data, item);
    });
};

exports.emitToUsers = function (event, data, userIds) {
    var me = this;
    userIds.forEach(function (item) {
        me.emitToUser(event, data, item.toString());
    });
};
