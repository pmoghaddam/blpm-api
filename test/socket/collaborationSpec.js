'use strict';

var helper = require('../testHelper');
var Q = require('q');

var userFixture = require('../fixtures/userFixture');
var taskListFixture = require('../fixtures/taskListFixture');

// TODO: Move into taskSocketSpec, since this is general
describe('Socket collaboration', function () {
    this.timeout(500);

    // Test variables
    var socket;
    var altSocket;

    var user = helper.user;
    var altUser;
    var taskList;
    var altTaskList;

    beforeEach(function (done) {
        var userDefer = Q.defer();
        var socketDefer = Q.defer();
        var altSocketDefer = Q.defer();
        Q.all([taskListFixture.createTaskList({user: user}),
                socketDefer.promise,
                altSocketDefer.promise,
                userDefer.promise]).then(function (result) {
                taskList = result[0];
                done();
            });


        // Create test user
        userFixture.createAltUser()
            .then(function (res) {
                altUser = res;
                userDefer.resolve(res);

                helper.loginAndConnect(null, function (data) {
                    socket = data.socket;
                    socketDefer.resolve();
                });
                helper.loginAndConnect({username: res.username, password: 'password'}, function (data) {
                    altSocket = data.socket;
                    altSocketDefer.resolve();
                });

                return taskListFixture.createTaskList({user: altUser});
            }).then(function (res) {
                altTaskList = res;
            });
    });

    afterEach(function () {
        altUser.remove();
        taskList.remove();
        altTaskList.remove();
        socket.disconnect();
        altSocket.disconnect();
    });

    /**
     * Tests
     */
    it('should emit a task event to the owner of the task', function (done) {
        var event = 'tasks:create';
        var data = {title: 'Title', taskList: taskList.id};

        socket.on(event, function (task) {
            assert.equal(task.title, data.title);
            done();
        });

        socket.emit(event, data);
    });


    it('should not emit a task event to an irrelevant user', function (done) {
        var event = 'tasks:create';
        var task1 = {title: 'Task #1', taskList: taskList.id};
        var task2 = {title: 'Task #2', taskList: altTaskList.id};

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
