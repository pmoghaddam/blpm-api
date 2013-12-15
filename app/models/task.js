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
    }
});

/**
 * Validations
 */
taskSchema.path('title').validate(function (title) {
    return title && title.length;
}, 'Title cannot be blank');


module.exports = mongoose.model('Task', taskSchema);