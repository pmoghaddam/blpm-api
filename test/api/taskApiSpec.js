'use strict';

var request = require('request');
var url = 'http://localhost:5001';
var versionedUrl = url + '/v0';
var Task = require('../../app/models/task'); // TODO: Improve relative paths

var io = require('socket.io-client');
var options = {
    transports: ['websocket'],
    'force new connection': true
};

// Globals
var task;

describe('Task model', function () {
    before(function () {
        Task.remove().exec();
    });

    beforeEach(function () {
        task = new Task({
            title: 'Sample Task'
        });

        task.save();
    });

    it('should get all tasks (RESTful)', function (done) {
        request(versionedUrl + '/tasks', function (error, response) {
            var tasks = JSON.parse(response.body);
            assert(tasks.length === 1);
            assert(tasks[0].title === 'Sample Task');
            done();
        });
    });

    it('should get all tasks (Socket)', function (done) {
        var client = io.connect(url, options);
        client.on('v0/tasks/list', function(tasks) {
            assert(tasks.length === 1);
            assert(tasks[0].title === 'Sample Task');
            done();
        });
        client.emit('v0/tasks/list');
    });

    it('should create task', function (done) {
        request.post(versionedUrl + '/tasks', {form: {title: 'Test Title'}},
            function (error, response) {
                var task = JSON.parse(response.body);
                assert(task.title === 'Test Title');
                done();
            });
    });

    it('should get a single task', function (done) {
        request.get(versionedUrl + '/tasks/' + task.id, function (error, response) {
            var task = JSON.parse(response.body);
            assert(task.title === 'Sample Task');
            done();
        });
    });

    it('should update a single task', function (done) {
        request.put(versionedUrl + '/tasks/' + task.id, {form: {title: 'Updated title'}},
            function (error, response) {
                var task = JSON.parse(response.body);
                assert(task.title === 'Updated title');
                done();
            });
    });

    it('should delete a single task', function (done) {
        var id = task.id;
        request.del(versionedUrl + '/tasks/' + id, function (error, response) {
            assert(response.statusCode === 200);
            Task.find({ _id: id}).count().exec(function (err, count) {
                assert(count === 0);
                done();
            });
        });
    });

    afterEach(function () {
        Task.remove().exec();
    });
});