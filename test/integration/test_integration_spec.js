'use strict';

require('../../server');
var request = require('request');
var url = 'http://localhost:' + 5001;

describe('Basic integration test', function () {
    it('should pass', function (done) {
        request(url, function (error, response) {
            assert.ok(response);
            done();
        });
    });
});


