'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Schema
 */
var taskSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
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