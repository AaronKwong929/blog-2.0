const Comment = require('../models/Comments');
const fn_createComment = async ctx => {
    const comment = Object.assign(ctx.request.body, {
        author: ctx.session.user.name,
        articleID: ctx.params.id
    });
    await Comment.create(comment);
    await ctx.redirect('back');
};

const fn_deleteComment = async ctx => {
    await Comment.findByIdAndDelete(ctx.params.cid);
    await ctx.redirect('back');
};

const fn_editComment = async ctx => {
    const comment = await Comment.findById(ctx.params.cid);
    if (ctx.method === 'GET') {
        await ctx.render('editComment', {
            articleID: ctx.params.aid,
            comment
        });
    } else if (ctx.method === 'POST') {
        //title = ctx.request.body.title,
        const content = ctx.request.body.content;
        //comment.title = title;
        comment.content = content;
        await comment.save();
        await ctx.redirect(`/articles/${ctx.params.aid}`);
    }
};

module.exports = {
    'POST /articles/:id/comments/new': fn_createComment,
    'GET /articles/:aid/comments/:cid/delete': fn_deleteComment,
    'GET /articles/:aid/comments/:cid/edit': fn_editComment,
    'POST /articles/:aid/comments/:cid/edit': fn_editComment,
};
