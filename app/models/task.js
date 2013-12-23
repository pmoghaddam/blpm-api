'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Schema
 */
var taskSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
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
    // Tasks should not be immediately deleted (needed for sync purposes)
    deleted: {
        type: Boolean,
        default: false
    }
});

/**
 * Validations
 */
taskSchema.path('title').validate(function (title) {
    return title && title.length;
}, 'Title cannot be blank');

/**
 * Statics
 */
taskSchema.statics = {
    all: function (cb) {
        this.find().sort('-created').exec(cb);
    },
    findById: function (id, cb) {
        this.findOne({
            _id: id
        }).exec(cb);
    }
};

module.exports = mongoose.model('Task', taskSchema);