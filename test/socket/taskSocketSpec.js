'use strict';

var helper = require('../testHelper');
var Task = rekuire.model('task');
var Q = require('q');

var userFixture = require('../fixtures/userFixture');
var taskFixture = require('../fixtures/taskFixture');
var taskListFixture = require('../fixtures/taskListFixture');

describe('Task Socket', function () {
    this.timeout(500);

    // Globals
    var task;
    var user;
    var taskList;
    var socket;

    before(function (done) {
        Q.all([
                Q.ninvoke(Task.remove(), 'exec'),
                userFixture.createUser()
            ]).then(function (result) {
                user = result[1];
                done();
            }).done();
    });

    after(function (done) {
        user.remove(done);
    });

    beforeEach(function (done) {
        taskListFixture.createTaskList({user: user})
            .then(function (res) {
                taskList = res;
                return taskFixture.createTask({user: user, taskList: taskList});
            }).then(function (res) {
                task = res;
                return helper.loginAndConnect({username: user.username});
            }).then(function (data) {
                socket = data.socket;
                done();
            }).done();
    });

    afterEach(function (done) {
        taskList.remove();
        socket.disconnect();
        Task.remove().exec(done);
    });

    /**
     * Tests
     */
    it('should get all tasks', function (done) {
        var event = 'tasks:list';
        socket.on(event, function (tasks) {
            assert.equal(tasks.length, 1);
            assert.equal(tasks[0].title, task.title);
            done();
        });
        socket.emit(event, {taskList: taskList.id});
    });

    it('should create a task', function (done) {
        var event = 'tasks:create';
        var data = {title: 'Socket Title', taskList: taskList.id};

        socket.on(event, function (task) {
            assert.equal(task.title, data.title);
            done();
        });

        socket.emit(event, data);
    });

    it('should show a task', function (done) {
        var event = 'tasks:show';
        socket.on(event, function (res) {
            assert.equal(res.title, task.title);
            done();
        });

        socket.emit(event, {id: task.id});
    });

    it('should update a task', function (done) {
        var event = 'tasks:update';
        var data = {id: task.id, title: 'New Title'};

        socket.on(event, function (res) {
            assert.equal(res.title, data.title);
            done();
        });

        socket.emit(event, data);
    });

    it('should delete a task', function (done) {
        var event = 'tasks:delete';
        var data = {id: task.id};

        socket.on(event, function (res) {
            assert.equal(res._id, data.id);
            done();
        });

        socket.emit(event, data);
    });
});
