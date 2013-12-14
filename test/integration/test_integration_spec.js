'use strict';

require('../../server');

var request = require('request');
var url = 'http://localhost:' + 5001;
var mongoose = require('mongoose');

describe('Basic integration test', function () {
    it('should contact server', function (done) {
        request(url, function (error, response) {
            assert.ok(response);
            done();
        });
    });

    it('should connect to MongoDb', function() {
        assert(mongoose.connection.name === 'blpm-test');
    });
});


