'use strict';

var helper = require('../testHelper');

var userFixture = require('../fixtures/userFixture');

describe('User Socket', function () {
    this.timeout(500);

    var user;
    var socket;

    before(function (done) {
        userFixture.createUser()
            .then(function (res) {
                user = res;
                return helper.loginAndConnect({username: user.username});
            }).then(function (data) {
                socket = data.socket;
                done();
            }).done();

    });

    after(function (done) {
        socket.disconnect();
        user.remove(done);
    });

    /**
     * Tests
     */
    it('should find all user details by ids', function (done) {
        socket.on('users:findAll', function (users) {
            assert.equal(users[0].email, user.email);
            assert.equal(users[0].name, user.name);
            done();
        });

        socket.emit('users:findAll', {users: [user.id]});
    });
});
