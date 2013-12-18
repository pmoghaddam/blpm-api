'use strict';

/**
 * @Deprecated - cross-application event-handling
 * caused confusion with workflow and prevented flexibility
 * in certain causes, e.g. preventing any distinction between
 * various model events (e.g. save).
 */

var task = rekuire.internalController('task');
var dispatcher = rekuire.lib('dispatcher');

// Notification events
module.exports = function () {
    dispatcher.on('tasks:create', task.create);
    dispatcher.on('tasks:delete', task.delete);
};
