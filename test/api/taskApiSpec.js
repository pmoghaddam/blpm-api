'use strict';

require('../testHelper');

var request = require('request');
var url = 'http://127.0.0.1:5001';
var versionedUrl = url + '/v0';
var Task = rekuire.model('task');

// Globals
var task;

describe('Task API', function () {
    before(function () {
        Task.remove().exec();
    });

    beforeEach(function () {
        task = new Task({
            title: 'Sample Task'
        });

        task.save();
    });

    it('should get all tasks', function (done) {
        request(versionedUrl + '/tasks', function (error, response) {
            var tasks = JSON.parse(response.body);
            assert(tasks.length === 1);
            assert(tasks[0].title === 'Sample Task');
            done();
        });
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