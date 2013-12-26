'use strict';

var helper = require('../testHelper');
var _ = require('underscore');
var Task = rekuire.model('task');
var User = rekuire.model('user');
var Q = require('q');
var taskService = rekuire.service('task');

var socket = rekuire.service('socket');
var sinon = require('sinon');

// Test globals
var task;
var altTask;
var user = helper.user;
var altUser;

describe('Task service (integration)', function () {
    this.timeout(500);

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
        var tasks = [
            {
                title: 'Sample Task',
                user: user
            },
            {
                title: 'Alt task',
                user: altUser
            }
        ];
        Task.create(tasks)
            .then(function (firstTask, secondTask) {
                task = firstTask;
                altTask = secondTask;
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

    /**
     * Tests
     */
    it('should list all tasks associated with a user', function (done) {
        taskService.list(user)
            .then(function (tasks) {
                var userTask = _.find(tasks, function (entry) {
                    return entry.id === task.id;
                });
                var altUserTask = _.find(tasks, function (entry) {
                    return entry.id === altTask.id;
                });
                assert.ok(userTask, "User's task not found");
                assert.notOk(altUserTask, 'Incorrect task found');
                done();
            })
            .fail(function (err) {
                done(err);
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