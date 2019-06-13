const Articles = require('../models/Articles');

const fn_articles = async ctx => {
    const articles = await Articles.find({});
    await ctx.render('articles', {
        articles
    });
};

const fn_readArticle = async ctx => {
    const _id = ctx.params.id;
    const article = await Articles.findById({ _id });
    if (!article) {
        return await ctx.render('fail-on-no-article');
    }
    await ctx.render('oneArticle', {
        article
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
            await article.save();
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

module.exports = {
    'GET /articles': fn_articles,
    'GET /articles/:id': fn_readArticle,
    'GET /new': fn_newArticle,
    'POST /new': fn_newArticle,
    'GET /articles/:id/delete': fn_deleteArticle,
    'GET /articles/:id/edit': fn_editArticle,
    'POST /articles/:id/edit': fn_editArticle
};
