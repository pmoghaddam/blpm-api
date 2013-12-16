'use strict';

require('../testHelper');
var Task = rekuire.model('task');

// Test globals
var task;

describe('Task model', function () {
    before(function() {
        Task.remove().exec();
    });

    beforeEach(function () {
        task = new Task({
            title: 'Sample Task'
        });
    });

    it('should save', function (done) {
        task.save(function (err) {
            assert.isNull(err);
            done();
        });
    });

    it('should validate', function(done) {
        task.title = null;
        task.save(function(err) {
            assert.ok(err);
            done();
        });
    });

    afterEach(function() {
        task.remove();
    });
});