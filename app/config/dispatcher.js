'use strict';

var task = rekuire.listener('task');
var dispatcher = rekuire.lib('dispatcher');

// Notification events
exports.dispatchListeners = function () {
    dispatcher.on('tasks:create', task.create);
};
