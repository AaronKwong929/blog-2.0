const Articles = require('../models/Articles');

const fn_articles = async ctx => {
    const articles = await Articles.find({});
    await ctx.render('articles', {
        articles
    });
};

const fn_readArticle = async ctx => {
    const _id = ctx.params.id;
    try {
        const article = await Articles.findById({ _id });
        if (!article) {
            throw new Error();
        }
        await ctx.render('oneArticle', {
            article
        });
    } catch (e) {
        ctx.render('fail-on-no-article');
    }
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
                author: 'Aaron'
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
    const id = ctx.params.id,
        deleteArticle = await Articles.findByIdAndDelete({ id });
    if (!deleteArticle) {
        await ctx.render('fail-on-delete');
    }
    await ctx.redirect('/articles');
};

const fn_editArticle = async ctx => {
    const id = ctx.params.id,
        article = await Articles.findById({ id });
    if (ctx.method === 'GET') {
        await ctx.render('editArticle', {
            article
        });
    } else if (ctx.method === 'POST') {
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
