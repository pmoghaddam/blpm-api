'use strict';

var helper = require('../testHelper');

var userService = rekuire.service('user');
var userFixture = require('../fixtures/userFixture');

describe('User Service (Integration)', function () {
    this.timeout(500);

    var user;

    before(function (done) {
        userFixture.createUser().then(function (res) {
            user = res;
            done();
        }).done();
    });

    after(function (done) {
        user.remove(done);
    });

    /**
     * Tests
     */
    it('should create user', function (done) {
        var data = {
            name: 'Name',
            email: 'userservice@test.com',
            username: 'userservice',
            password: 'password'
        };

        userService.create(data).then(function (user) {
            assert.equal(user.email, data.email);
            user.remove();
            done();
        }).done();
    });

    it('show and get endpoints are identical', function () {
        assert.equal(userService.get, userService.show);
    });

    it('should get a user by arbitrary (white-listed) field', function (done) {
        userService.find({email: user.email}).then(function (res) {
            assert.equal(res.email, user.email);
            done();
        }).done();
    });

});
