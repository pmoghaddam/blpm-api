'use strict';

var helper = require('../testHelper');
var Task = rekuire.model('task');

var taskListFixture = require('../fixtures/taskListFixture');

describe('Task (integration)', function () {
    this.timeout(500);

    // Test globals
    var task;
    var user = helper.user;
    var taskList;

    /**
     * Setup & tear down logic
     */
    before(function (done) {
        Task.remove().exec(done);
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

    afterEach(function () {
        taskList.remove();
        task.remove();
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