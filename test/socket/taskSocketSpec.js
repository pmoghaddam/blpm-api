'use strict';

var helper = require('../testHelper');
var url = helper.url;
var Task = rekuire.model('task');
var io = require('socket.io-client');

// Globals
var task;
var socket;

describe('Task Socket', function () {
    before(function (done) {
        Task.remove().exec(function () {
            done();
        });
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

    it('should get all tasks', function (done) {
        socket.on('tasks:list', function (tasks) {
            assert(tasks.length === 1);
            assert(tasks[0].title === 'Sample Task');
            done();
        });
        socket.emit('tasks:list');
    });

    it('should get create updates', function (done) {
        socket.on('tasks:create', function (task) {
            assert(task.title === 'Socket Title');
            done();
        });

        socket.on('connect', function () {
            var userId = helper.user.id.toString();
            socket.emit('tasks:create', {title: 'Socket Title', user: userId});
        });
    });

    afterEach(function (done) {
        Task.remove().exec(function () {
            done();
        });
        socket.disconnect();
    });
});
