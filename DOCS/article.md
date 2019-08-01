# 文章相关

## 文章模型设计 -- 参考[数据模型 - models](https://github.com/AaronKwong929/blog-2.0/blob/master/DOCS/database.md/#文章模型)

## 文章列表页

```javascript
const fn_articles = async ctx => {
    try {
        const pageSize = 5;
        const currentPage = parseInt(ctx.query.page) || 1;
        const allArticlesCount = await Articles.countDocuments();
        const pageCount = Math.ceil(allArticlesCount / pageSize);
        const pageStart = currentPage - 2 > 0 ? currentPage - 2 : 1;
        const pageEnd =
            currentPage + 2 >= pageCount ? pageCount : currentPage + 2;
        const baseUrl = `${ctx.path}?page=`;
        const articles = await Articles.find({})
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize);
        if (JSON.stringify(articles) === 'null' || articles.length === 0) {
            throw new Error('不存在文章');
        }
        await ctx.render('articles', {
            articles,
            currentPage,
            pageCount,
            pageStart,
            pageEnd,
            baseUrl
        });
    } catch (e) {
        await ctx.render('error', {
            e
        });
    }
};
```

1. 分页器的内容详见 -> [分页器]()

2. 如果 articles 为空，给出没有文章错误

## 文章详情

```javascript
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
```

1. 以文章的\_id 为识别，从文章、点赞、评论库抓取数据渲染页面

2. 先初始化 hasLikedOrDisliked 为空对象，不能用 const，后面还会对其有修改，不可以在 hasLikedOrDisliked = await likesAndDislikes.findUser(ctx.session.user.id);这里定义的原因：如果该用户没有对该文章进行点赞，返回的 hasLikedOrDisliked 传入渲染页将会报错

## 新建文章

```javascript
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
```

1. get 下检测管理员权限，无权限跳出错误，有权限继续渲染新建文章页面

2. post 下 使用 Object.assign()，将（标题，类型，内容）与作者（session.user.name）合成一个对象并 Articles.create(post)创建新文章，并且在 like 中创建该文章

## 删除文章

```javascript
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
```

1. 需要管理员权限

2. cascade 删除没做好，需要分别在 likes 和 comments 删除

## 修改文章与修改用户同思想 [修改用户](https://github.com/AaronKwong929/blog-2.0/blob/master/DOCS/user.md/#修改个人信息)

## 路由

```javascript
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
```
