const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: {
        type: String
    },
    content: {
        type: String
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

module.exports = mongoose.model('Comments', commentSchema);
