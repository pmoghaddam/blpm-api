'use strict';

var task = rekuire.internalController('task');
var dispatcher = rekuire.lib('dispatcher');

// Notification events
module.exports = function () {
    dispatcher.on('tasks:create', task.create);
    dispatcher.on('tasks:delete', task.delete);

};
