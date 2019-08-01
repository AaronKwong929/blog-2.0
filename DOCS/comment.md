# 评论相关

## [评论模型设计](https://github.com/AaronKwong929/blog-2.0/blob/master/DOCS/database.md/#评论模型)

## 新建评论

```javascript
const fn_createComment = async ctx => {
    const comment = Object.assign(ctx.request.body, {
        author: ctx.session.user.name,
        articleID: ctx.params.id
    });
    await Comment.create(comment);
    await ctx.redirect('back');
};
```

1. 创建新评论后返回文章详情页

2. Object.assign() （评论标题、内容）与文章id和评论作者

## 删除评论

```javascript
const fn_deleteComment = async ctx => {
    await Comment.findByIdAndDelete(ctx.params.cid);
    await ctx.redirect('back');
};
```

1. 删除评论后redirect到文章页面

## 修改评论

```javascript
const fn_editComment = async ctx => {
    const comment = await Comment.findById(ctx.params.cid);
    if (ctx.method === 'GET') {
        await ctx.render('editComment', {
            articleID: ctx.params.aid,
            comment
        });
    } else if (ctx.method === 'POST') {
        const content = ctx.request.body.content;
        comment.content = content;
        await comment.save();
        await ctx.redirect(`/articles/${ctx.params.aid}`);
    }
};
```

## 路由

```javascript
module.exports = {
    'POST /articles/:id/comments/new': fn_createComment,
    'GET /articles/:aid/comments/:cid/delete': fn_deleteComment,
    'GET /articles/:aid/comments/:cid/edit': fn_editComment,
    'POST /articles/:aid/comments/:cid/edit': fn_editComment
};
```
