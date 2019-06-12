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
        default: 'aar',
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

articleSchema.pre('save', async function (next) {
    const article = this;
    const now = new Date().getTime();
    if (article.updatedAt !== now) {
        article.updatedAt = now;
    }
    next();
});

module.exports = mongoose.model('Article', articleSchema);