# Aaron's blog system v2.0

## 工程记录

1. 2019-6-9 完成登陆验证和参数从后到前的传输

## 期望实现的新功能：

1. ~~~采用数据库~~~  
2. CSS 自己写  
3. textarea 有 md 功能  
4. ~~~登陆状态保持koa-session~~~  
5. 评论区 controller  
6. 文章 controller
7. 响应式布局  
8. 文章分类  
9. ~~~bcrypt 加密密码，实现了一半，考虑匹配密码的问题~~~  
10. ~~~koa 有没有像 express 那样的 router.post('/users/logout', auth, async (req, res) =>? ~~~  
11. ~~~数据库操作学 node 课的~~~  
12. ~~~加一个 node 课的 middlewares 的 authentication？~~~  
13. ~~~controllers 文件夹里面的东西，分开存放，user，article，index~~~  
14. 个人信息界面  
15. ~~~实现登陆前导航条右侧登陆/注册，登陆后是“欢迎回来，xxx”  想法：1. toggle 2. 新建一个 block 用 if 判断~~~  
16. 实时检测邮箱是否注册完成，密码是否纯数字/小于 6 位 ->ajax?

## 疑难点：

1. 必须最后注册 z404.js 才可以避免打开任何页面都返回 404

## 已解决：

### 2019-6-8 ctx.state 无法传 session 内容到前端模板

```javascript
app.use(async (ctx, next) => {
    ctx.state.user = ctx.session.user;
    await next();
});
```

### 解决方法：把这一段代码放到 ↓ 之前即可解决问题

```javascript
app.use(controller());
```

### 切入点：中间件的执行顺序

