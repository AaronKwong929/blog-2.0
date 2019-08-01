# 基于 Koa.JS，MongoDB 实现的个人博客系统 2.0

## 项目目录

---  
| - Abolitions  // 废案  
| - DOCS  
&nbsp;&nbsp;&nbsp;&nbsp;| - controllers/  // 控制器文档  
&nbsp;&nbsp;&nbsp;&nbsp;| - middlewares/  // 中间件文档  
&nbsp;&nbsp;&nbsp;&nbsp;| - views/  // 静态资源文档  
&nbsp;&nbsp;&nbsp;&nbsp;| - database.md  // 数据模型  
&nbsp;&nbsp;&nbsp;&nbsp;| - Q&A.md  // 疑难解答  
&nbsp;&nbsp;&nbsp;&nbsp;| - statics.md  // 处理静态资源的文档  
| - src  // 资源目录  
&nbsp;&nbsp;&nbsp;&nbsp;| - configs/  
&nbsp;&nbsp;&nbsp;&nbsp;| - controllers/  
&nbsp;&nbsp;&nbsp;&nbsp;| - middlewares/  
&nbsp;&nbsp;&nbsp;&nbsp;| - models/  
&nbsp;&nbsp;&nbsp;&nbsp;| - statics/  
&nbsp;&nbsp;&nbsp;&nbsp;| - views/  
| - app.js  // 总控  
| - readme.md  // 总文档  
| - package.json  
---  

## 文档导航

[数据模型 - models](https://github.com/AaronKwong929/blog-2.0/blob/master/DOCS/database.md)

[中间件 - middlewares](https://github.com/AaronKwong929/blog-2.0/tree/master/DOCS/middlewares)

[静态资源 - statics](https://github.com/AaronKwong929/blog-2.0/blob/master/DOCS/statics.md)

[编写过程中碰到的问题以及解决方案](https://github.com/AaronKwong929/blog-2.0/blob/master/DOCS/Q%26A.md)

[各种废案 - abolitions](https://github.com/AaronKwong929/blog-2.0/tree/master/Abolitions)

[用户相关](https://github.com/AaronKwong929/blog-2.0/blob/master/DOCS/user.md)
  
用户注册  
用户登陆  
用户注销  
用户登录状态保持  

[文章相关](https://github.com/AaronKwong929/blog-2.0/blob/master/DOCS/article.md)

文章增删改查  
文章发表  
文章列表与详情  
文章编辑与删除  

[评论功能](/)

设计评论的模型 -- 参考[数据模型 - models](https://github.com/AaronKwong929/blog-2.0/blob/master/DOCS/database.md)  
发布评论  
显示评论  
删除评论

[分页功能](/)

MongoDB 分页原理  
分页器的逻辑  

[点赞点踩功能](https://github.com/AaronKwong929/blog-2.0/blob/master/DOCS/likeOrDislike.md)
