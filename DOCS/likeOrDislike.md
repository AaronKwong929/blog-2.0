# 点赞点踩相关

## [点赞模型设计](https://github.com/AaronKwong929/blog-2.0/blob/master/DOCS/database.md/#点赞/点踩模型)

## 点赞->在 article.js 内编写

```javascript
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
```

## 点踩思路相同不再赘述
