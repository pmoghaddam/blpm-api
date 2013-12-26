'use strict';

var helper = require('../testHelper');
var _ = require('underscore');
var Task = rekuire.model('task');
var User = rekuire.model('user');
var Q = require('q');
var taskService = rekuire.service('task');

var socket = rekuire.service('socket');
var sinon = require('sinon');

var taskFixture = require('../fixtures/taskFixture');
var taskListFixture = require('../fixtures/taskListFixture');


describe('Task service (integration)', function () {
    this.timeout(500);

    // Test globals
    var task;
    var altTask;
    var user = helper.user;
    var altUser;

    /**
     * Setup & tear down logic
     */
    before(function (done) {
        Task
            .remove()
            .exec()
            .then(function () {
                altUser = new User({
                    name: 'Alt',
                    email: 'altusertesting@email.com',
                    username: 'altuser',
                    password: 'password',
                    token: '78651'
                });
                altUser.save(done);
            });
    });

    beforeEach(function (done) {
        var data = [
            {
                title: 'Sample Task',
                user: user
            },
            {
                title: 'Alt task',
                user: altUser
            }
        ];

        taskFixture.createTasks(data)
            .then(function (tasks) {
                task = tasks[0];
                altTask = tasks[1];
                done();
            });
    });

    afterEach(function (done) {
        task.remove();
        altTask.remove(done);
    });

    after(function (done) {
        altUser.remove(done);
    });

    describe('using a Task List', function () {
        var taskList;
        var taskListTask;

        beforeEach(function (done) {
            taskListFixture.createTaskList(user)
                .then(function (input) {
                    taskList = input;
                    return taskFixture.createTask({user: user, taskList: input});
                }).then(function (input) {
                    taskListTask = input;
                    done();
                });
        });

        afterEach(function (done) {
            taskList.remove();
            taskListTask.remove(done);
        });

        it('should list all (uncategorized) tasks associated with a user', function (done) {
            taskService.list(user)
                .then(function (tasks) {
                    var userTask = _.find(tasks, function (entry) {
                        return entry.id === task.id;
                    });
                    var altUserTask = _.find(tasks, function (entry) {
                        return entry.id === altTask.id;
                    });
                    var taskListsTask = _.find(tasks, function (entry) {
                        return entry.id === taskListTask.id;
                    });
                    assert.ok(userTask, "User's task not found");
                    assert.notOk(altUserTask, 'Incorrect task found');
                    assert.notOk(taskListsTask, 'Task list task found in uncategorized category');
                    done();
                })
                .fail(function (err) {
                    done(err);
                });
        });

        it('should list all tasks associated with a task list (excludes uncategorized)', function (done) {
            taskService.list(user, taskList)
                .then(function (tasks) {
                    var userTask = _.find(tasks, function (entry) {
                        return entry.id === task.id;
                    });
                    var taskListsTask = _.find(tasks, function (entry) {
                        return entry.id === taskListTask.id;
                    });
                    assert.notOk(userTask);
                    assert.ok(taskListsTask);
                    done();
                })
                .fail(function (err) {
                    done(err);
                });
        });

        it('should not list tasks from a unauthorized task list', function (done) {
            var altTaskListTask;

            taskListFixture.createTaskList(altUser)
                .then(function (input) {
                    return taskFixture.createTask({user: altUser, taskList: input});
                }).then(function (input) {
                    altTaskListTask = input;
                    return taskService.list(user, taskList);
                }).then(function (tasks) {
                    var unauthTask = _.find(tasks, function (entry) {
                        return entry.id === altTaskListTask.id;
                    });
                    assert.notOk(unauthTask);
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
        taskService.create({title: 'Brand New Task'}, user)
            .then(function (task) {
                assert.ok(task, 'Task could not be created');
                assert.equal(task.user.toString(), user.id);

                // Clean up
                task.remove(done);
            });
    });

    describe('notifications for a task', function () {
        beforeEach(function () {
            sinon.stub(socket, 'emitToCollaborators');
        });

        afterEach(function () {
            socket.emitToCollaborators.restore();
        });

        it('should notify collaborators for a task created', function (done) {
            taskService.create({title: 'New Task Title'}, user)
                .then(function (task) {
                    assert(socket.emitToCollaborators.calledOnce);
                    assert(socket.emitToCollaborators.calledWith('tasks:create'));
                    task.remove(done);
                });
        });

        it('should notify collaborators for a task updated', function (done) {
            taskService.update(task.id, {title: 'Updated Title'}, user)
                .then(function () {
                    assert(socket.emitToCollaborators.calledOnce);
                    assert(socket.emitToCollaborators.calledWith('tasks:update'));
                    done();
                });
        });

        it('should notify collaborators for a task deleted', function (done) {
            taskService.delete(task.id, user)
                .then(function () {
                    assert(socket.emitToCollaborators.calledOnce);
                    assert(socket.emitToCollaborators.calledWith('tasks:delete'));
                    done();
                });
        });
    });

});