'use strict';

require('../testHelper');
var TaskList = rekuire.model('taskList');
var taskListService = rekuire.service('taskList');
var userFixture = require('../fixtures/userFixture');
var taskListFixture = require('../fixtures/taskListFixture');

var Q = require('q');
var socket = rekuire.service('socket');
var sinon = require('sinon');

describe('Task List service (Integration)', function () {
    this.timeout(500);

    // Test variables
    var taskList;
    var user;
    var altUser;

    before(function (done) {
        var query = TaskList.remove();

        Q.all([
                Q.ninvoke(query, 'exec'),
                userFixture.createUser(),
                userFixture.createAltUser()
            ]).then(function (result) {
                user = result[1];
                altUser = result[2];
                done();
            });
    });

    beforeEach(function (done) {
        taskListFixture.createTaskList({user: user})
            .then(function (doc) {
                taskList = doc;
                done();
            });
    });

    afterEach(function (done) {
        taskList.remove(done);
    });

    after(function (done) {
        Q.all([
                Q.ninvoke(user, 'remove'),
                Q.ninvoke(altUser, 'remove')
            ]).then(function () {
                done();
            });
    });

    describe('CRUD', function () {
        it('should get all task lists of a user', function (done) {
            taskListService.list(user)
                .then(function (taskLists) {
                    assert.equal(taskLists.length, 1);
                    assert.equal(taskLists[0].title, taskList.title);
                    done();
                });
        });

        it('should create a new task list', function (done) {
            var data = {
                title: 'New'
            };

            taskListService.create(data, user)
                .then(function (taskList) {
                    assert.ok(taskList);
                    assert.equal(taskList.title, data.title);

                    taskList.remove();
                    done();
                });

        });

        it('should update a task list (if a collaborator)', function (done) {
            var data = {title: 'Updated'};
            taskListService.update(taskList.id.toString(), data, user)
                .then(function (taskList) {
                    assert.equal(taskList.title, data.title);
                    done();
                });
        });

        it('should not be able to update an unauthorized task list', function (done) {
            var data = {title: 'Updated'};
            taskListService.update(taskList.id.toString(), data, altUser)
                .fail(function (err) {
                    assert.ok(err);
                    done();
                });
        });

        it('should read a task list (if a collaborator)', function (done) {
            taskListService.show(taskList.id.toString(), user)
                .then(function (doc) {
                    assert.equal(doc.id.toString(), taskList.id.toString());
                    done();
                });
        });

        it('should not read an unauthorized task list', function (done) {
            taskListService.show(taskList.id.toString(), altUser)
                .fail(function (err) {
                    assert.ok(err);
                    done();
                });
        });

        it('should delete an authorized task list', function (done) {
            var id = taskList.id.toString();
            taskListService.delete(id, user)
                .then(function (doc) {
                    assert.ok(doc);

                    taskListService.show(id, user).fail(function (err) {
                        assert.ok(err);
                        done();
                    });
                });
        });

        it('should not delete an unauthorized task list', function (done) {
            var id = taskList.id.toString();
            taskListService.delete(id, altUser)
                .fail(function (err) {
                    assert.ok(err);
                    done();
                });
        });
    });

    describe('collaboration', function () {

        it('should add collaborators', function (done) {
            assert.isFalse(taskList.isAuthorized(altUser));

            taskListService.addCollaborator(taskList.id.toString(), altUser, 'editor')
                .then(function (doc) {
                    assert.isTrue(doc.isAuthorized(altUser));
                    done();
                });
        });

        it('should remove collaborators', function (done) {
            taskListService.addCollaborator(taskList.id, altUser, 'editor')
                .then(function () {
                    return taskListService.removeCollaborator(taskList.id, altUser);
                }).then(function (doc) {
                    assert.isFalse(doc.isAuthorized(altUser));
                    done();
                });
        });

        // TODO: Not yet implemented until collaboration features are fleshed out
        it('should update access of a collaborator');
    });

    describe('notification of the task list', function () {
        beforeEach(function () {
            sinon.stub(socket, 'emitToUser');
        });

        afterEach(function () {
            socket.emitToUser.restore();
        });

        it('should notify the user of a task list being added', function (done) {
            taskListService.create({title: 'New Task List'}, user)
                .then(function (taskList) {
                    assert(socket.emitToUser.calledOnce);
                    assert(socket.emitToUser.calledWith('taskLists:create'));
                    taskList.remove(done);
                });
        });

        it('should notify the user of a task list being updated', function (done) {
            var data = {title: 'Updated Name'};
            taskListService.update(taskList.id, data, user)
                .then(function () {
                    assert(socket.emitToUser.calledOnce);
                    assert(socket.emitToUser.calledWith('taskLists:update'));
                    done();
                });
        });

        it('should notify the user of a task list being removed', function (done) {
            taskListService.delete(taskList.id, user)
                .then(function () {
                    assert(socket.emitToUser.calledOnce);
                    assert(socket.emitToUser.calledWith('taskLists:delete'));
                    done();
                });
        });


        it('should notify a user of being added as a collaborator', function (done) {
            taskListService.addCollaborator(taskList.id, altUser, 'editor')
                .then(function () {
                    assert(socket.emitToUser.calledOnce);
                    assert(socket.emitToUser.calledWith('collaborator:create'));
                    done();
                });
        });

        it('should notify a user of being removed as a collaborator', function (done) {
            taskListService.addCollaborator(taskList.id, altUser, 'editor')
                .then(function () {
                    return taskListService.removeCollaborator(taskList.id, altUser);
                })
                .then(function () {
                    assert(socket.emitToUser.calledTwice);
                    assert(socket.emitToUser.calledWith('collaborator:delete'));
                    done();
                });
        });
    });

});
