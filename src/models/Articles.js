const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    author: {
        type: String,
        trim: true,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: 'none'
    },
    createdAt: {
        type: String,
        default: new Date().getTime(),
    },
    updatedAt: {
        type: String,
        default: new Date().getTime(),
    }
});

module.exports = mongoose.model('Task', taskSchema);