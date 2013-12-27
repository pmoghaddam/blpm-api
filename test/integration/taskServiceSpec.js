'use strict';

require('../testHelper');
var _ = require('underscore');
var Task = rekuire.model('task');
var Q = require('q');
var taskService = rekuire.service('task');

var userFixture = require('../fixtures/userFixture');
var taskFixture = require('../fixtures/taskFixture');
var taskListFixture = require('../fixtures/taskListFixture');


describe('Task service (integration)', function () {
    this.timeout(500);

    // Test globals
    var task;
    var taskList;
    var altTask;
    var altTaskList;
    var user;
    var altUser;

    /**
     * Setup & tear down logic
     */
    before(function (done) {
        Q.all([
                Q.ninvoke(Task.remove(), 'exec'),
                userFixture.createUser(),
                userFixture.createAltUser()
            ]).then(function (result) {
                user = result[1];
                altUser = result[2];
                done();
            });
    });

    after(function (done) {
        Q.all([
                Q.ninvoke(altUser, 'remove'),
                Q.ninvoke(user, 'remove')
            ]).then(function () {
                done();
            });
    });

    beforeEach(function (done) {

        taskListFixture.createTaskList({user: user})
            .then(function (res) {
                taskList = res;
                return taskFixture.createTask({
                    title: 'Sample Task',
                    user: user,
                    taskList: taskList
                });
            }).then(function (doc) {
                task = doc;
                return taskListFixture.createTaskList({user: altUser});
            }).then(function (input) {
                altTaskList = input;
                return taskFixture.createTask({
                    title: 'Alt task',
                    user: user,
                    taskList: altTaskList
                });
            }).then(function (input) {
                altTask = input;
                done();
            });
    });

    afterEach(function (done) {
        Q.all([
                Q.ninvoke(task, 'remove'),
                Q.ninvoke(taskList, 'remove'),
                Q.ninvoke(altTaskList, 'remove'),
                Q.ninvoke(altTask, 'remove')
            ]).then(function () {
                done();
            });
    });

    describe('using multiple Task Lists', function () {
        var otherTaskList;
        var otherTask;

        beforeEach(function (done) {
            taskListFixture.createTaskList({user: user})
                .then(function (input) {
                    otherTaskList = input;
                    return taskFixture.createTask({user: user, taskList: input});
                }).then(function (input) {
                    otherTask = input;
                    done();
                });
        });

        afterEach(function (done) {
            otherTaskList.remove();
            otherTask.remove(done);
        });

        it('should list all tasks associated with a user', function (done) {
            taskService.list(user, taskList.id)
                .then(function (tasks) {
                    var userTask = _.find(tasks, function (entry) {
                        return entry.id === task.id;
                    });
                    var altUserTask = _.find(tasks, function (entry) {
                        return entry.id === altTask.id;
                    });

                    assert.ok(userTask);
                    assert.notOk(altUserTask);
                    done();
                })
                .fail(function (err) {
                    done(err);
                });
        });

        it('should not list tasks from a separate task list', function (done) {
            taskService.list(user, taskList.id)
                .then(function (tasks) {
                    var userTask = _.find(tasks, function (entry) {
                        return entry.id === task.id;
                    });
                    var otherTaskFound = _.find(tasks, function (entry) {
                        return entry.id === otherTask.id;
                    });
                    assert.ok(userTask);
                    assert.notOk(otherTaskFound);
                    done();
                })
                .fail(function (err) {
                    done(err);
                });
        });
    });

    it('should show a task associated with a user', function (done) {
        var asyncTests = [
            taskService.show(task.id, user)
                .then(function (task) {
                    assert.ok(task, "User's task not found");
                }),
            taskService.show(altTask.id, user)
                .fail(function (err) {
                    assert.ok(err, "Able to load other user's tasks");
                })
        ];

        Q.all(asyncTests).then(function () {
            done();
        });
    });

    it('should update a task associated with a user', function (done) {
        var asyncTests = [
            taskService.update(task.id, {title: 'Updated Title'}, user)
                .then(function (task) {
                    assert.ok(task, "User's task could not be updated");
                }),
            taskService.update(altTask.id, {title: 'Updated Title'}, user)
                .fail(function (err) {
                    assert.ok(err, "Able to update other user's task");
                })
        ];

        Q.all(asyncTests).then(function () {
            done();
        });
    });

    it('should delete a task associated with a user', function (done) {
        var asyncTests = [
            taskService.delete(task.id, user)
                .then(function (task) {
                    assert.ok(task, "User's task could not be deleted");
                }),
            taskService.update(altTask.id, user)
                .fail(function (err) {
                    assert.ok(err, "Able to delete other user's task");
                })
        ];

        Q.all(asyncTests).then(function () {
            done();
        });
    });

    it('should create a task for a user', function (done) {
        taskService.create({title: 'Brand New Task', taskList: taskList.id}, user)
            .then(function (task) {
                assert.ok(task, 'Task could not be created');
                assert.equal(task.user.toString(), user.id);

                // Clean up
                task.remove(done);
            });
    });

});