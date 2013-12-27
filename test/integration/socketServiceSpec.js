'use strict';

var helper = require('../testHelper');
var socketService = rekuire.service('socket');

var userFixture = require('../fixtures/userFixture');

describe('Socket service (integration)', function () {
    this.timeout(500);

    // Test variables
    var socket;
    var user;

    /**
     * Setup & tear down logic
     */
    before(function (done) {
        userFixture.createUser()
            .then(function (res) {
                user = res;
                done();
            });
    });

    after(function (done) {
        user.remove(done);
    });

    beforeEach(function (done) {
        helper.loginAndConnect(null, function (data) {
            socket = data.socket;
            done();
        });
    });

    afterEach(function () {
        socket.disconnect();
    });

    /**
     * Tests
     */
    it("should emit an event to user for all of user's sockets", function (done) {
        var event = 'test';
        var data = {title: 'title'};

        socket.on(event, function (res) {
            assert.equal(res.title, data.title);
            done();
        });

        socketService.emitToUser(event, data, user.id);
    });
});
