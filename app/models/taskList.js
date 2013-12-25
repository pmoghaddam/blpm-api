'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');
var Task = rekuire.model('task');

/**
 * Schema
 */
var schema = new Schema({
    title: {
        type: String,
        default: '',
        required: true
    },
    collaborators: [
        {
            user: {
                type: Schema.ObjectId,
                ref: 'User',
                required: true
            },
            access: {
                type: String,
                enum: ['owner', 'editor'],
                required: true
            }
        }
    ]
});

/**
 * Validations
 */
schema.path('title').validate(function (title) {
    return title && title.length;
}, 'Title cannot be blank');

schema.path('collaborators').validate(function (collaborators) {
    return !_.isEmpty(collaborators);
}, 'Must have a collaborator associated');

schema.path('collaborators').validate(function (collaborators) {
    return !!_.find(collaborators, function (item) {
        return item.access === 'owner';
    });
}, 'Must have an owner associated');

/**
 * Methods
 */
schema.methods = {
    isAuthorized: function (user) {
        var authorized = _.find(this.collaborators, function (item) {
            return item.user.equals(user.id);
        });
        return !!authorized;
    },

    addCollaborator: function (user, access, cb) {
        this.collaborators.push({
            user: user.id,
            access: access
        });
        return this.save(cb);
    },

    removeCollaborator: function (user, cb) {
        this.collaborators = _.reject(this.collaborators, function (item) {
            return item.user.equals(user.id);
        });
        return this.save(cb);
    },

    /**
     * Retrieve all tasks associated with this task list
     * @param cb
     */
    tasks: function (cb) {
        Task.find({taskList: this.id}, function (err, tasks) {
            cb(tasks);
        });
    }
};

schema.statics = {
    findByUser: function (user, cb) {
        this.find({ 'collaborators.user': user }, cb);
    }
};

module.exports = mongoose.model('TaskList', schema);