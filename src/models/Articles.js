const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    author: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
    type: {
        type: String,
    },
    createdAt: {
        type: String,
        default: new Date().toLocaleString(),
    },
    updatedAt: {
        type: String,
        default: new Date().toLocaleString(),
    }
});

articleSchema.pre('save', async function (next) {
    const article = this;
    const now = new Date().toLocaleString();
    if (article.updatedAt !== now) {
        article.updatedAt = now;
    }
    next();
});

module.exports = mongoose.model('Article', articleSchema);