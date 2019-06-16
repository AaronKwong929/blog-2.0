const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    articleID: {
        type: String
    },
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

commentSchema.pre('save', async function (next) {
    const comment = this;
    const now = new Date().getTime();
    if (comment.updatedAt !== now) {
        comment.updatedAt = now;
    }
    next();
});

module.exports = mongoose.model('Comments', commentSchema);
