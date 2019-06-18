const Articles = require('../models/Articles');
const Comments = require('../models/Comments');
const Likes = require('../models/Likes');

const fn_articles = async ctx => {
    const articles = await Articles.find({});
    await ctx.render('articles', {
        articles
    });
};

const fn_readArticle = async ctx => {
    var hasLikedOrDisliked = {};
    const _id = ctx.params.id;
    const article = await Articles.findById({ _id });
    if (!article) {
        return await ctx.render('fail-on-no-article');
    }
    const comments = await Comments.find({ articleID: _id });
    const likesAndDislikes = await Likes.findOne({ ArticleID: _id });
    // const hasLiked = await likesAndDislikes.findUser(ctx.session.user.id);  // 貌似能成
    console.log(hasLiked);
    if (ctx.session.user) {
        hasLikedOrDisliked = likesAndDislikes.userIDs.find(
            user => user.userID === ctx.session.user.id
        );
        // hasLiked = await likesAndDislikes.findUser(ctx.session.user.id);
    }
    await ctx.render('oneArticle', {
        article,
        comments,
        likesAndDislikes,
        hasLikedOrDisliked
    });
};

const fn_newArticle = async ctx => {
    if (ctx.method === 'GET') {
        if (!ctx.session.user.isAdmin) {
            await ctx.render('need-admin');
        }
        await ctx.render('newArticle');
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
    if (!ctx.session.user.isAdmin) {
        return await ctx.render('need-Admin');
    }
    const _id = ctx.params.id,
        deleteArticle = await Articles.findByIdAndDelete({ _id });
    if (!deleteArticle) {
        await ctx.render('fail-on-delete');
    }
    await ctx.redirect('/articles');
};

const fn_editArticle = async ctx => {
    if (!ctx.session.user.isAdmin) {
        return await ctx.render('need-Admin');
    }
    const _id = ctx.params.id,
        article = await Articles.findById({ _id });
    if (ctx.method === 'GET') {
        await ctx.render('editArticle', {
            article
        });
    } else if (ctx.method === 'POST') {
        article.title = ctx.request.body.title;
        article.type = ctx.request.body.type;
        article.content = ctx.request.body.type;
        await article.save();
        await ctx.redirect(`/articles/${article._id}`);
    }
};

const fn_like = async ctx => {
    const likesAndDislikes = await Likes.findOne({
        ArticleID: ctx.params.id
    });
    try {
        // const hasLikedOrDisliked = await likesAndDislikes.findUser(ctx.session.user.id);
        const hasLikedOrDisliked = likesAndDislikes.userIDs.find(
            user => user.userID === ctx.session.user.id
        );
        if (hasLikedOrDisliked) {
            throw new Error();
        }
        likesAndDislikes.likes++;
        likesAndDislikes.userIDs.push({ userID: ctx.session.user.id });
        await likesAndDislikes.save();
        // await likesAndDislikes.like();
        await ctx.redirect('back');
    } catch (e) {
        await ctx.render('404');
    }
};

const fn_dislike = async ctx => {
    const article = await Likes.findOne({ ArticleID: ctx.params.id });
    const likesAndDislikes = await Likes.findOne({
        ArticleID: ctx.params.id
    });
    try {
        // const hasLikedOrDisliked = likesAndDislikes.findUser(ctx.session.user.id);
        const hasLikedOrDisliked = likesAndDislikes.userIDs.find(
            user => user.userID === ctx.session.user.id
        );
        if (hasLikedOrDisliked) {
            throw new Error();
        }
        article.dislikes++;
        article.userIDs.push({ userID: ctx.session.user.id });
        await article.save();
        await ctx.redirect('back');
    } catch (e) {
        await ctx.render('404');
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
