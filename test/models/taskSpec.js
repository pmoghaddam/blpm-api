'use strict';

var helper = require('../testHelper');
var Task = rekuire.model('task');
var TaskList = rekuire.model('taskList');

describe('Task (integration)', function () {

    // Test globals
    var task;
    var user = helper.user;

    /**
     * Setup & tear down logic
     */
    before(function (done) {
        Task.remove().exec(done);
    });

    beforeEach(function () {
        task = new Task({
            title: 'Sample Task',
            user: helper.user
        });
    });

    afterEach(function () {
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

    describe('using a Task List', function () {
        var taskList;

        beforeEach(function (done) {
            taskList = new TaskList({
                title: 'Primary',
                collaborators: [
                    {
                        user: user,
                        access: 'owner'
                    }
                ]
            });
            taskList.save(done);
        });

        afterEach(function (done) {
            taskList.remove(done);
        });


        it('should be able to associate a task to a task list', function (done) {
            task.taskList = taskList;
            task.save(function (err) {
                assert.isNull(err);
                done();
            });
        });

    });

});