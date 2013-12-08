'use strict';

var request = require('request');

describe('Basic integration test', function () {
    it('should pass', function (done) {
        request('http://localhost:5000', function (error, response) {
            assert.ok(response);
            done();
        });
    });
});


