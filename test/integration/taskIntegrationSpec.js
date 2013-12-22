'use strict';

var helper = require('../testHelper');
var Task = rekuire.model('task');

// Test globals
var task;

describe('Task (integration)', function () {
    this.timeout(500);

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

});