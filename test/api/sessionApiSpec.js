'use strict';

var helper = require('../testHelper');
var request = require('superagent');
var User = rekuire.model('user');

var userFixture = require('../fixtures/userFixture');

describe('Session API', function () {
    this.timeout(500);

    var user;
    var url = helper.url;
    var versionedUrl = url + '/v0';

    before(function (done) {
        userFixture.createUser()
            .then(function (res) {
                user = res;
                done();
            }).done();
    });

    after(function (done) {
        user.remove(done);
    });

    describe('authentication', function () {
        it('should authenticate user', function (done) {
            request
                .post(versionedUrl + '/session')
                .send({username: user.username, password: 'password'})
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    done();
                });
        });

        it('should not authenticate faulty user', function (done) {
            request
                .post(versionedUrl + '/session')
                .send({username: 'wrong', password: 'wrong'})
                .end(function (err, res) {
                    assert.equal(res.status, 401);
                    done();
                });
        });

        it('should get token for authenticated user', function (done) {
            request
                .post(versionedUrl + '/token')
                .send({username: user.username, password: 'password'})
                .end(function (err, res) {
                    assert.equal(res.body.access_token, user.token);
                    done();
                });
        });

        it('should not get token for unauthenticated user', function (done) {
            request
                .post(versionedUrl + '/token')
                .send({username: 'wrong', password: 'wrong'})
                .end(function (err, res) {
                    assert.equal(res.status, 401);
                    done();
                });
        });

        it('should logout authenticated user', function (done) {
            var agent = request.agent();
            agent
                .post(versionedUrl + '/session')
                .send({username: user.username, password: 'password'})
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    // Now logout
                    agent
                        .del(versionedUrl + '/session')
                        .end(function (err, res) {
                            assert.equal(res.status, 200);
                            done();
                        });
                });
        });
    });

    describe('registration', function () {
        it('should register a new user', function (done) {
            request.post(versionedUrl + '/registration')
                .send({name: 'Payam',
                    email: 'registrationtest@test.com',
                    username: 'registrationtest',
                    password: 'payam'})
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    // Clean up
                    User.remove({email: 'registrationtest@test.com'}).exec();

                    done();
                });
        });
    });
});