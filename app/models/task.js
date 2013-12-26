'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Schema
 */
var schema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    taskList: {
        type: Schema.ObjectId,
        ref: 'TaskList'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    title: {
        type: String,
        default: '',
        required: true
    },
    deadlineAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['notStarted', 'inProgress', 'completed'],
        default: 'notStarted',
        required: true
    },
    priority: {
        type: Number,
        default: 0
    },
    // Longer description than what title offers
    description: {
        type: String
    },
    // Additional box to capture extra information
    notes: {
        type: String
    },
    // Enables easier distinction client-side and allows
    // offline capability in the future
    guid: String,
    // Tasks should not be immediately deleted (needed for sync purposes)
    deleted: {
        type: Boolean,
        default: false
    }
});

/**
 * Validations
 */
schema.path('title').validate(function (title) {
    return title && title.length;
}, 'Title cannot be blank');

/**
 * Statics
 */
schema.statics = {
    all: function (cb) {
        this.find().sort('-created').exec(cb);
    }
};

module.exports = mongoose.model('Task', schema);