'use strict';

var auth = rekuire.apiController('authentication');

module.exports = function (app, passport) {
    var version = '/v0';
//    var tokenAuth = passport.authenticate('bearer', { session: false });
//
//    app.get(version + '/tasks', tokenAuth, task.list);
//    app.post(version + '/tasks', tokenAuth, task.create);
//    app.get(version + '/tasks/:id', tokenAuth, task.show);
//    app.put(version + '/tasks/:id', tokenAuth, task.update);
//    app.del(version + '/tasks/:id', tokenAuth, task.delete);

    // Authentication for session-based connections (e.g. Socket.IO)
    app.post(version + '/session', passport.authenticate('local'), auth.session);
    app.del(version + '/session', auth.logout);
    app.post(version + '/registration', auth.registration);

    // Authentication to retrieve token
    app.post(version + '/token', passport.authenticate('local', { session: false }), auth.token);
};