'use strict';

var helper = require('../testHelper');
var request = require('superagent');
var url = helper.url;
var Task = rekuire.model('task');
var io = require('socket.io-client');

// Globals
var task;
var client;

describe('Task Socket', function () {
    before(function (done) {
        Task.remove().exec(function () {
            done();
        });
    });

    beforeEach(function (done) {
        task = new Task({
            title: 'Sample Task'
        });
        task.save(function () {
            done();
        });

        client = io.connect(url, helper.ioOptions);
    });

    it('should get all tasks', function (done) {
        client.on('tasks:list', function (tasks) {
            assert(tasks.length === 1);
            assert(tasks[0].title === 'Sample Task');
            done();
        });
        client.emit('tasks:list');
    });

    it('should get create updates', function (done) {
        client.on('tasks:create', function (task) {
            assert(task.title === 'Socket Title');
            done();
        });

        client.on('connect', function () {
            request.post(url + '/v0/tasks')
                .sendWithToken({title: 'Socket Title'})
                .end();
        });
    });

    afterEach(function (done) {
        Task.remove().exec(function () {
            done();
        });
        client.disconnect();
    });
});
