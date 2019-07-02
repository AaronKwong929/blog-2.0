const Articles = require('../models/Articles');
const Comments = require('../models/Comments');
const Likes = require('../models/Likes');

const fn_articles = async ctx => {
    try {
        const pageSize = 2;
        const currentPage = parseInt(ctx.query.page) || 1;
        const allPostsCount = await Articles.countDocuments();
   		const pageCount = Math.ceil(allPostsCount / pageSize);
        const articles = await Articles.find({})
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize);
        if (JSON.stringify(articles) === 'null' || articles.length === 0) {
            throw new Error('不存在文章');
        }
        await ctx.render('articles', {
            articles,
            currentPage,
            pageCount
        });
    } catch (e) {
        await ctx.render('error', {
            e
        });
    }
};

const fn_readArticle = async ctx => {
    var hasLikedOrDisliked = {};
    const _id = ctx.params.id;
    try {
        const article = await Articles.findById({ _id });
        if (JSON.stringify(article) === 'null') {
            throw new Error('不存在文章');
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
        await ctx.render('error', {
            e
        });
    }
};

const fn_newArticle = async ctx => {
    if (ctx.method === 'GET') {
        try {
            if (!ctx.session.user.isAdmin) {
                throw new Error('需要管理员权限');
            }
            await ctx.render('newArticle');
        } catch (e) {
            await ctx.render('error', {
                e
            });
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
            await ctx.render('error', {
                e
            });
        }
    }
};

const fn_deleteArticle = async ctx => {
    try {
        if (!ctx.session.user.isAdmin) {
            throw new Error('需要管理员权限');
        }
        await Articles.findByIdAndDelete(ctx.params.id);
        await Comments.findOneAndDelete({ articleID: ctx.params.id });
        await Likes.findOneAndDelete({ articleID: ctx.params.id });
        await ctx.redirect('/articles');
    } catch (e) {
        await ctx.render('error', {
            e
        });
    }
};

const fn_editArticle = async ctx => {
    const article = await Articles.findById(ctx.params.id);
    if (ctx.method === 'GET') {
        try {
            if (!ctx.session.user.isAdmin) {
                throw new Error('需要管理员权限');
            }
            await ctx.render('editArticle', {
                article
            });
        } catch (e) {
            await ctx.render('error', {
                e
            });
        }
    } else if (ctx.method === 'POST') {
        try {
            article.title = ctx.request.body.title;
            article.type = ctx.request.body.type;
            article.content = ctx.request.body.content;
            await article.save();
            await ctx.redirect(`/articles/${article._id}`);
        } catch (e) {
            await ctx.render('error', {
                e
            });
        }
    }
};

const fn_like = async ctx => {
    try {
        if (!ctx.session.user) {
            throw new Error('请先登陆再进行操作');
        }
        const likesAndDislikes = await Likes.findOne({
            ArticleID: ctx.params.id
        });
        const hasLikedOrDisliked = await likesAndDislikes.findUser(
            ctx.session.user.id
        );
        if (hasLikedOrDisliked) {
            throw new Error('您已操作');
        }
        await likesAndDislikes.like(ctx.session.user.id);
        await ctx.redirect('back');
    } catch (e) {
        await ctx.render('error', {
            e
        });
    }
};

const fn_dislike = async ctx => {
    try {
        const likesAndDislikes = await Likes.findOne({
            ArticleID: ctx.params.id
        });
        if (!ctx.session.user) {
            throw new Error('请先登陆再进行操作');
        }
        const hasLikedOrDisliked = await likesAndDislikes.findUser(
            ctx.session.user.id
        );
        if (hasLikedOrDisliked) {
            throw new Error('您已操作');
        }
        await likesAndDislikes.dislike(ctx.session.user.id);
        await ctx.redirect('back');
    } catch (e) {
        await ctx.render('error', {
            e
        });
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
