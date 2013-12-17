'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dispatcher = rekuire.lib('dispatcher');

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

// TODO: Extract this functionality outside
taskSchema.post('save', function (task) {
    dispatcher.emit('tasks:create', task.toObject());
});
taskSchema.post('remove', function (task) {
    dispatcher.emit('tasks:delete', task.toObject());
});

module.exports = mongoose.model('Task', taskSchema);