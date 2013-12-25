'use strict';

var helper = require('../testHelper');
var socketService = rekuire.service('socket');

// Test variables
var socket;
var user;

describe('Socket service (integration)', function () {
    /**
     * Setup & tear down logic
     */
    this.timeout(500);

    beforeEach(function (done) {
        user = helper.user;
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

        socketService.emitToUser(event, data, user);
    });
});
