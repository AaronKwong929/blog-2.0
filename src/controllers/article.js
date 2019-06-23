const Articles = require('../models/Articles');
const Comments = require('../models/Comments');
const Likes = require('../models/Likes');

const fn_articles = async ctx => {
    try {
        const articles = await Articles.find({});
        await ctx.render('articles', {
            articles
        });
    } catch (e) {
        await ctx.render('failed-on-fetch-articles');
    }
};

const fn_readArticle = async ctx => {
    var hasLikedOrDisliked = {};
    const _id = ctx.params.id;
    try {
        const article = await Articles.findById({ _id });
        if (!article) {
            throw new Error();
        }
        const comments = await Comments.find({ articleID: _id });
        const likesAndDislikes = await Likes.findOne({ ArticleID: _id });
        if (ctx.session.user) {
            hasLikedOrDisliked = await likesAndDislikes.findUser(
                ctx.session.user.id
            );
        }
        await ctx.render('oneArticle', {
            article,
            comments,
            likesAndDislikes,
            hasLikedOrDisliked
        });
    } catch (e) {
        await ctx.render('fail-on-no-article');
    }
};

const fn_newArticle = async ctx => {
    if (ctx.method === 'GET') {
        try {
            if (!ctx.session.user.isAdmin) {
                throw new Error();
            }
            await ctx.render('newArticle');
        } catch (e) {
            await ctx.render('need-admin');
        }
    } else if (ctx.method === 'POST') {
        try {
            const post = Object.assign(ctx.request.body, {
                author: ctx.session.user.name
            });
            const article = await Articles.create(post);
            await Likes.create(Object.assign({ ArticleID: article._id }));
            await ctx.redirect(`/articles/${article._id}`);
        } catch (e) {
            await ctx.render('fail-on-new');
        }
    }
};

const fn_deleteArticle = async ctx => {
    try {
        if (!ctx.session.user.isAdmin) {
            throw new Error();
        }
        await Articles.findByIdAndDelete(ctx.params.id);
        await Comments.findOneAndDelete({ articleID: ctx.params.id });
        await Likes.findOneAndDelete({ articleID: ctx.params.id });
        await ctx.redirect('/articles');
    } catch (e) {
        await ctx.render('need-Admin');
    }
};

const fn_editArticle = async ctx => {
    const article = await Articles.findById(ctx.params.id);
    if (ctx.method === 'GET') {
        try {
            if (!ctx.session.user.isAdmin) {
                throw new Error();
            }
            await ctx.render('editArticle', {
                article
            });
        } catch (e) {
            await ctx.render('need-Admin');
        }
    } else if (ctx.method === 'POST') {
        try {
            article.title = ctx.request.body.title;
            article.type = ctx.request.body.type;
            article.content = ctx.request.body.content;
            await article.save();
            await ctx.redirect(`/articles/${article._id}`);
        } catch (e) {
            await ctx.render('fail-on-edit');
        }
    }
};

const fn_like = async ctx => {
    const likesAndDislikes = await Likes.findOne({
        ArticleID: ctx.params.id
    });
    try {
        const hasLikedOrDisliked = await likesAndDislikes.findUser(
            ctx.session.user.id
        );
        if (hasLikedOrDisliked) {
            throw new Error();
        }
        await likesAndDislikes.like(ctx.session.user.id);
        await ctx.redirect('back');
    } catch (e) {
        await ctx.render('fail-on-like-dislike');
    }
};

const fn_dislike = async ctx => {
    const likesAndDislikes = await Likes.findOne({
        ArticleID: ctx.params.id
    });
    try {
        const hasLikedOrDisliked = await likesAndDislikes.findUser(
            ctx.session.user.id
        );
        if (hasLikedOrDisliked) {
            throw new Error();
            // throw new Error('has liked or disliked');
        }
        await likesAndDislikes.dislike(ctx.session.user.id);
        await ctx.redirect('back');
    } catch (e) {
        await ctx.render('fail-on-like-dislike');
        // await ctx.render('fail-on-like-dislike',
        // message: e);
    }
};

module.exports = {
    'GET /articles': fn_articles,
    'GET /articles/:id': fn_readArticle,
    'GET /new': fn_newArticle,
    'POST /new': fn_newArticle,
    'GET /articles/:id/delete': fn_deleteArticle,
    'GET /articles/:id/edit': fn_editArticle,
    'POST /articles/:id/edit': fn_editArticle,
    'GET /articles/:id/like': fn_like,
    'GET /articles/:id/dislike': fn_dislike
};
