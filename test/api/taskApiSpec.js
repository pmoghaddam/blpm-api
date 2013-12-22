'use strict';

var helper = require('../testHelper');
var request = require('superagent');
var url = helper.url;
var versionedUrl = url + '/v0';
var Task = rekuire.model('task');

// Globals
var task;

describe('Task API', function () {
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
    });

    it('should get all tasks', function (done) {
        request.get(versionedUrl + '/tasks')
            .sendWithToken()
            .end(function (res) {
                var tasks = res.body;
                assert(tasks.length === 1);
                assert(tasks[0].title === 'Sample Task');
                done();
            });
    });

    it('should create task', function (done) {
        var userId = helper.user.id.toString();
        request.post(versionedUrl + '/tasks')
            .sendWithToken({title: 'Test Title', user: userId})
            .end(function (res) {
                var task = res.body;
                assert(task.title === 'Test Title');
                done();
            });
    });

    it('should get a single task', function (done) {
        request.get(versionedUrl + '/tasks/' + task.id)
            .sendWithToken()
            .end(function (res) {
                var task = res.body;
                assert(task.title === 'Sample Task');
                done();
            });
    });

    it('should update a single task', function (done) {
        request.put(versionedUrl + '/tasks/' + task.id)
            .sendWithToken({title: 'Updated Title'})
            .end(function (res) {
                var task = res.body;
                assert(task.title === 'Updated Title');
                done();
            });
    });

    it('should delete a single task', function (done) {
        var id = task.id;
        request.del(versionedUrl + '/tasks/' + id)
            .sendWithToken()
            .end(function (res) {
                assert(res.statusCode === 200);
                Task.find({ _id: id}).count().exec(function (err, count) {
                    assert(count === 0);
                    done();
                });
            });
    });

    afterEach(function (done) {
        Task.remove().exec(function () {
            done();
        });
    });
});