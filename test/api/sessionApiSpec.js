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
                assert(res.status === 200, 'Unable to login authenticated user');
                done();
            });
    });

    it('should not authenticate faulty user', function (done) {
        request
            .post(versionedUrl + '/session')
            .send({username: 'wrong', password: 'wrong'})
            .end(function (err, res) {
                assert(res.status === 401, 'Unauthorized access expected');
                done();
            });
    });

    it('should get token for authenticated user', function (done) {
        request
            .post(versionedUrl + '/token')
            .send({username: 'user', password: 'password'})
            .end(function (err, res) {
                assert(res.body.access_token === helper.user.token, 'Invalid token received');
                done();
            });
    });

    it('should not get token for unauthenticated user', function (done) {
        request
            .post(versionedUrl + '/token')
            .send({username: 'wrong', password: 'wrong'})
            .end(function (err, res) {
                assert(res.status === 401, 'Unauthorized access expected');
                done();
            });
    });

});