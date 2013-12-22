'use strict';

var helper = require('../testHelper');
var url = helper.url;
var Task = rekuire.model('task');
var io = require('socket.io-client');

// Globals
var task;
var socket;

describe('Task Socket', function () {
    this.timeout(500);

    before(function (done) {
        Task.remove().exec(done);
    });

    beforeEach(function (done) {
        task = new Task({
            title: 'Sample Task',
            user: helper.user
        });
        task.save(function () {
            done();
        });

        socket = io.connect(url, helper.ioOptions);
    });

    afterEach(function (done) {
        Task.remove().exec(done);
        socket.disconnect();
    });

    /**
     * Tests
     */
    it('should get all tasks', function (done) {
        var event = 'tasks:list';
        socket.on(event, function (tasks) {
            assert(tasks.length === 1);
            assert(tasks[0].title === 'Sample Task');
            done();
        });
        socket.emit(event);
    });

    it('should create a task', function (done) {
        var event = 'tasks:create';
        var data = {title: 'Socket Title'};

        socket.on(event, function (task) {
            assert(task.title === data.title);
            done();
        });

        socket.emit(event, data);
    });

    it('should show a task', function (done) {
        var event = 'tasks:show';
        socket.on(event, function (res) {
            assert(res.title === task.title);
            done();
        });

        socket.emit(event, {id: task.id});
    });

    it('should update a task', function (done) {
        var event = 'tasks:update';
        var data = {id: task.id, title: 'New Title'};

        socket.on(event, function (res) {
            assert(res.title === data.title);
            done();
        });

        socket.emit(event, data);
    });

    it('should delete a task', function (done) {
        var event = 'tasks:delete';
        var data = {id: task.id};

        socket.on(event, function (res) {
            assert(res._id === data.id);
            done();
        });

        socket.emit(event, data);
    });
});
