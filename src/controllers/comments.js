const Comment = require('../models/Comments');
const createComment = async ctx => {
    const comment = Object.assign(ctx.request.body, {
        author: ctx.session.user.name,
        articleID: ctx.params.id
    });
    await Comment.create(comment);
    await ctx.redirect('back');
};


module.exports = {
    'POST /articles/:id/comments/new': createComment
}