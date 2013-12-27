'use strict';

require('../testHelper');
var Task = rekuire.model('task');
var Q = require('q');

var userFixture = require('../fixtures/userFixture');
var taskListFixture = require('../fixtures/taskListFixture');

describe('Task (integration)', function () {
    this.timeout(500);

    // Test globals
    var task;
    var user;
    var taskList;

    /**
     * Setup & tear down logic
     */
    before(function (done) {
        Q.all([
                Q.ninvoke(Task.remove(), 'exec'),
                userFixture.createUser()
            ]).then(function (result) {
                user = result[1];
                done();
            });

    });

    after(function (done) {
        user.remove(done);
    });

    beforeEach(function (done) {
        taskListFixture.createTaskList({user: user})
            .then(function (res) {
                taskList = res;
                task = new Task({
                    title: 'Sample Task',
                    user: user,
                    taskList: taskList
                });
                done();
            });

    });

    afterEach(function (done) {
        Q.all([
            Q.ninvoke(taskList, 'remove'),
            Q.ninvoke(taskList, 'remove')
        ]).then(function () {
            done();
        });
    });

    /**
     * Tests
     */
    it('should save', function (done) {
        task.save(function (err) {
            assert.isNull(err);
            done();
        });
    });

    it('should validate', function (done) {
        task.title = null;
        task.save(function (err) {
            assert.ok(err);
            done();
        });
    });

});