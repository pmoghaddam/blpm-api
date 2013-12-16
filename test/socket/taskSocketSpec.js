'use strict';

require('../testHelper');
var request = require('request');
var url = 'http://127.0.0.1:5001';
var Task = rekuire.model('task');

var io = require('socket.io-client');
var options = {
    transports: ['websocket'],
    'force new connection': true
};

// Globals
var task;
var client;

describe('Task Socket', function () {
    before(function () {
        Task.remove().exec();
    });

    beforeEach(function () {
        task = new Task({
            title: 'Sample Task'
        });
        task.save();
        client = io.connect(url, options);
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

        client.on('connect', function() {
            request.post(url + '/v0/tasks', {form: {title: 'Socket Title'}});
        });
    });

    afterEach(function () {
        Task.remove().exec();
        client.disconnect();
    });
});
