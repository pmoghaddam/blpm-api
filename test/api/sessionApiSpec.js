'use strict';

var helper = require('../testHelper');
var request = require('superagent');
var url = helper.url;
var versionedUrl = url + '/v0';

describe('Session API', function () {

    it('should authenticate user', function (done) {
        request
            .post(versionedUrl + '/session')
            .send({username: 'user', password: 'password'})
            .end(function (err, res) {
                assert(res.status === 200);
                done();
            });
    });

    it('should not authenticate faulty user', function (done) {
        request
            .post(versionedUrl + '/session')
            .send({username: 'wrong', password: 'wrong'})
            .end(function (err, res) {
                assert(res.status === 401);
                done();
            });
    });

});