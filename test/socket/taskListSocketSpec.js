'use strict';

var helper = require('../testHelper');
var TaskList = rekuire.model('task');

var taskListFixture = require('../fixtures/taskListFixture');
var userFixture = require('../fixtures/userFixture');

describe('Task List Socket', function () {
    this.timeout(500);

    // Globals
    var taskList;
    var socket;
    var user = helper.user;

    before(function (done) {
        TaskList.remove().exec(done);
    });

    beforeEach(function (done) {
        taskListFixture.createTaskList(user)
            .then(function (doc) {
                taskList = doc;
                helper.loginAndConnect(null, function (data) {
                    socket = data.socket;
                    done();
                });
            });
    });

    afterEach(function () {
        taskList.remove();
        socket.disconnect();
    });

    /**
     * Tests
     */
    it('should get all task lists', function (done) {
        var event = 'taskLists:list';
        socket.on(event, function (taskLists) {
            assert.equal(taskLists.length, 1);
            assert.equal(taskLists[0].title, taskList.title);
            done();
        });
        socket.emit(event);
    });

    it('should show a task list', function (done) {
        var event = 'taskLists:show';
        socket.on(event, function (res) {
            assert.equal(res.title, taskList.title);
            done();
        });
        socket.emit(event, {id: taskList.id});
    });

    it('should create a task list', function (done) {
        var event = 'taskLists:create';
        var data = {title: 'Socket Task List Title'};

        socket.on(event, function (taskList) {
            assert.equal(taskList.title, data.title);
            done();
        });

        socket.emit(event, data);
    });

    it('should update a task list', function (done) {
        var event = 'taskLists:update';
        var data = {id: taskList.id, title: 'New Title'};

        socket.on(event, function (res) {
            assert.equal(res.title, data.title);
            done();
        });

        socket.emit(event, data);
    });

    it('should delete a task list', function (done) {
        var event = 'taskLists:delete';
        var data = {id: taskList.id};

        socket.on(event, function (res) {
            assert.equal(res._id, data.id);
            done();
        });

        socket.emit(event, data);
    });

    describe('collaboration', function () {
        var altUser;
        var altSocket;

        beforeEach(function (done) {
            userFixture.createAltUser({password: 'password'}).then(function (user) {
                altUser = user;

                helper.loginAndConnect({username: altUser.username, password: 'password'}, function (data) {
                    altSocket = data.socket;
                    done();
                });
            });
        });

        afterEach(function (done) {
            altUser.remove(done);
            altSocket.disconnect();
        });

        it('should add a collaborator', function (done) {
            var event = 'collaborator:create';
            var data = {id: taskList.id, user: altUser.id, access: 'editor'};

            altSocket.on(event, function (res) {
                assert.equal(res._id, data.id);
                done();
            });

            socket.emit(event, data);
        });

        it('should remove a collaborator', function (done) {
            var event = 'collaborator:delete';
            var data = {id: taskList.id, user: altUser.id};
            taskList.addCollaborator(altUser, 'editor');

            altSocket.on(event, function (res) {
                assert.equal(res._id, data.id);
                done();
            });

            socket.emit(event, data);
        });
    });

});
