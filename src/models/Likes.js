const mongoose = require('mongoose');

const likesSchema = new mongoose.Schema({
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    ArticleID: {
        type: String,
    },
    userIDs: [{
        userID: {
            type: String
        }
    }],
});

module.exports = mongoose.model('Likes', likesSchema);