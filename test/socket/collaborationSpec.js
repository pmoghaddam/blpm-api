'use strict';

var helper = require('../testHelper');
var Q = require('q');
var User = rekuire.model('user');

// Test variables
var socket;
var altSocket;

// TODO: Move into taskSocketSpec, since this is general
describe('Socket collaboration', function () {
    this.timeout(500);

    beforeEach(function (done) {
        var userDefer = Q.defer();
        var socketDefer = Q.defer();
        var altSocketDefer = Q.defer();
        Q.all([socketDefer.promise,
                altSocketDefer.promise,
                userDefer.promise]).then(function () {
                done();
            });


        // Create test user
        User.create({
            name: 'Full name',
            email: 'test2@test.com',
            token: '123456789',
            username: 'user2',
            password: 'password'
        }, function (err, user) {
            userDefer.resolve(user);
        });

        helper.loginAndConnect(null, function (data) {
            socket = data.socket;
            socketDefer.resolve();
        });
        helper.loginAndConnect({username: 'user2', password: 'password'}, function (data) {
            altSocket = data.socket;
            altSocketDefer.resolve();
        });
    });

    afterEach(function () {
        socket.disconnect();
        altSocket.disconnect();
    });

    /**
     * Tests
     */
    it('should emit a task event to the owner of the task', function (done) {
        var event = 'tasks:create';
        var data = {title: 'Title'};

        socket.on(event, function (task) {
            assert.equal(task.title, data.title);
            done();
        });

        socket.emit(event, data);
    });

    describe('collaboration capabilities', function () {

        it('should not emit a task event to an irrelevant user', function (done) {
            var event = 'tasks:create';
            var task1 = {title: 'Task #1'};
            var task2 = {title: 'Task #2'};

            var socketDefer = Q.defer();
            var altSocketDefer = Q.defer();
            Q.all([socketDefer.promise,
                    altSocketDefer.promise]).then(function () {
                    done();
                });

            socket.on(event, function (task) {
                assert.equal(task.title, task1.title);
                socketDefer.resolve(task);
            });
            altSocket.on(event, function (task) {
                assert.equal(task.title, task2.title);
                altSocketDefer.resolve(task);
            });

            socket.emit(event, task1);
            altSocket.emit(event, task2);
        });
    });

});
