'use strict';

var task = rekuire.apiController('task');

module.exports = function (app, passport) {
    var version = '/v0';
    var authenticate = passport.authenticate('bearer', { session: false });

    app.get(version + '/tasks', authenticate, task.list);
    app.post(version + '/tasks', authenticate, task.create);
    app.get(version + '/tasks/:id', authenticate, task.show);
    app.put(version + '/tasks/:id', authenticate, task.update);
    app.del(version + '/tasks/:id', authenticate, task.delete);
};