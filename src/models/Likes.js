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

// likesSchema.methods.findUser = async function(id) {
//     const likesAndDislikes = this;
//     return likesAndDislikes.userIDs.find(
//         user => user.userID === id
//     );
// };

// likesSchema.methods.like = async function() {
//     const likesAndDislikes = this;
//     likesAndDislikes.likes++;
//     likesAndDislikes.userIDs.push({ userID: ctx.session.user.id });
//     await this.save();
// };

module.exports = mongoose.model('Likes', likesSchema);