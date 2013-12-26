'use strict';

var helper = require('../testHelper');
var TaskList = rekuire.model('taskList');
var Task = rekuire.model('task');
var User = rekuire.model('user');
var Q = require('q');

describe('Task List (Integration)', function () {
    this.timeout(500);

    // Test variables
    var user = helper.user;
    var taskList;

    /**
     * Setup & tear down logic
     */
    before(function (done) {
        TaskList.remove().exec(done);
    });

    beforeEach(function (done) {
        taskList = new TaskList({
            title: 'Sample Task List',
            collaborators: [
                {
                    user: user,
                    access: 'owner'
                }
            ]
        });
        taskList.save(done);
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


    describe('using Tasks', function () {
        var task1, task2;

        beforeEach(function (done) {

            task1 = new Task({title: 'Task #1', taskList: taskList, user: user});
            task2 = new Task({title: 'Task #2', user: user});

            Q.all([
                    Q.ninvoke(task1, 'save'),
                    Q.ninvoke(task2, 'save')
                ]).then(function () {
                    done();
                });
        });

        afterEach(function (done) {
            Q.all([
                    Q.ninvoke(task1, 'remove'),
                    Q.ninvoke(task2, 'remove')
                ]).then(function () {
                    done();
                });
        });

        it('should be able to retrieve all tasks associated with itself', function (done) {
            taskList.tasks(function (tasks) {
                assert.equal(tasks.length, 1);
                assert.equal(tasks[0].title, 'Task #1');
                done();
            });
        });
    });


    describe('collaboration', function () {
        var altUser;

        beforeEach(function (done) {
            User.create({
                name: 'Full name',
                email: 'test2@test.com',
                token: '123456789',
                username: 'user2',
                password: 'password'
            }, function (err, user) {
                altUser = user;
                done();
            });
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
