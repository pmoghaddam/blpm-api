'use strict';

var task = rekuire.apiController('task');
var session = rekuire.apiController('session');

module.exports = function (app, passport) {
    var version = '/v0';
    var authenticate = passport.authenticate('bearer', { session: false });

    app.get(version + '/tasks', authenticate, task.list);
    app.post(version + '/tasks', authenticate, task.create);
    app.get(version + '/tasks/:id', authenticate, task.show);
    app.put(version + '/tasks/:id', authenticate, task.update);
    app.del(version + '/tasks/:id', authenticate, task.delete);

    // Authentication for session-based connections
    app.post(version + '/session', passport.authenticate('local'), session.session);
};