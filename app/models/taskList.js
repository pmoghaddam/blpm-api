'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('underscore');

/**
 * Schema
 */
var schema = new Schema({
    title: {
        type: String,
        default: '',
        required: true
    },
    // Simplifies client-side sync and allows offline capability
    guid: String,
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

    hasCollaborator: function(user) {
        // Simple implementation for now
        return this.isAuthorized(user);
    },

    addCollaborator: function (user, access) {
        this.collaborators.push({
            user: user.id,
            access: access
        });
        return this;
    },

    removeCollaborator: function (user) {
        this.collaborators = _.reject(this.collaborators, function (item) {
            return item.user.equals(user.id);
        });
        return this;
    },

    /**
     * Convenience method to extract all users
     * @returns {*}
     */
    users: function () {
        return _.map(this.collaborators, function (item) {
            return item.user;
        });
    }
};

schema.statics = {
    findByUser: function (user, cb) {
        this.find({ 'collaborators.user': user }, cb);
    }
};

module.exports = mongoose.model('TaskList', schema);