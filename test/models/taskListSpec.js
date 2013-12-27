'use strict';

require('../testHelper');
var TaskList = rekuire.model('taskList');
var Q = require('Q');

var userFixture = require('../fixtures/userFixture');
var taskListFixture = require('../fixtures/taskListFixture');

describe('Task List (Integration)', function () {
    this.timeout(500);

    // Test variables
    var user;
    var taskList;

    /**
     * Setup & tear down logic
     */
    before(function (done) {
        Q.all([
                Q.ninvoke(TaskList.remove(), 'exec'),
                userFixture.createUser()
            ]).then(function (result) {
                user = result[1];
                done();
            }).done();
    });

    after(function (done) {
        user.remove(done);
    });

    beforeEach(function (done) {
        taskListFixture.createTaskList({user: user})
            .then(function (res) {
                taskList = res;
                done();
            }).done();
    });

    afterEach(function () {
        taskList.remove();
    });

    describe('persistence', function () {
        it('should save', function () {
            assert.ok(taskList);
        });

        it('should update', function (done) {
            var newTitle = 'New Title';
            TaskList.findByIdAndUpdate(taskList.id, {title: newTitle}, function (err, updated) {
                assert.isNull(err);
                assert.equal(updated.title, newTitle);
                done();
            });
        });

        it('should be deletable', function (done) {
            TaskList.findByIdAndRemove(taskList.id, function (err, doc) {
                assert.isNull(err);
                assert.ok(doc);
                done();
            });
        });

        it('should be possible to query all task lists of a user', function (done) {
            TaskList.findByUser(user, function (err, taskLists) {
                assert.equal(taskLists.length, 1);
                assert.equal(taskLists[0].title, taskList.title);
                done();
            });
        });
    });

    describe('collaboration', function () {
        var altUser;

        beforeEach(function (done) {
            userFixture.createAltUser()
                .then(function (res) {
                    altUser = res;
                    done();
                }).done();
        });

        afterEach(function (done) {
            altUser.remove(done);
        });

        it('should be associated to at least one user', function (done) {
            taskList.collaborators = null;
            taskList.save(function (err) {
                assert.ok(err);
                done();
            });
        });

        it('should be shareable with another user', function (done) {
            assert.isFalse(taskList.isAuthorized(altUser));

            // Verify before save
            taskList.addCollaborator(altUser, 'editor');
            assert.isTrue(taskList.isAuthorized(altUser));

            // Verify post save
            taskList.save(function (err) {
                assert.isNull(err);
                assert.isTrue(taskList.isAuthorized(altUser));
                done();
            });
        });

        it('should be un-shareable with another user', function (done) {
            taskList.addCollaborator(altUser, 'editor').save(function () {

                // Verify before save
                taskList.removeCollaborator(altUser);
                assert.isFalse(taskList.isAuthorized(altUser));

                // Verify post save
                taskList.save(function (err) {
                    assert.isNull(err);
                    assert.isFalse(taskList.isAuthorized(altUser));
                    done();
                });
            });
        });

        it('should have one associated user be owner', function (done) {
            taskList.addCollaborator(altUser, 'editor');
            taskList.removeCollaborator(user);
            taskList.save(function (err) {
                assert.ok(err);
                done();
            });
        });

    });

});
