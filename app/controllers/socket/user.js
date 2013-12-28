'use strict';

var userService = rekuire.service('user');
var _ = require('underscore');

var lean = function (items) {
    return _.map(items, function (item) {
        return item.toObject();
    });
};

exports.findAll = function (data, done) {
    return userService.findAllByIds(data.users).then(function (res) {
        var users = lean(res);
        done(users);
    });
};