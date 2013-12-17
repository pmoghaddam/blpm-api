'use strict';

var task = rekuire.apiController('task');

module.exports = function (app) {
    var version = '/v0';

    app.get(version + '/tasks', task.list);
    app.post(version + '/tasks', task.create);
    app.get(version + '/tasks/:id', task.show);
    app.put(version + '/tasks/:id', task.update);
    app.del(version + '/tasks/:id', task.delete);
};