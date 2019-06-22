# Aaron's blog system v2.0

## 工程记录

1. 2019-6-9 完成登陆验证和参数从后到前的传输

## 期望实现的新功能

1. ~~~采用数据库~~~
2. CSS 自己写
3. ~~~textarea 有 md 功能~~~
4. ~~~登陆状态保持 koa-session~~~
5. 评论区 controller
6. ~~~文章 controller~~~
7. 响应式布局（有点难度咯  
8. ~~~文章分类~~~
9. ~~~bcrypt 加密密码，实现了一半，考虑匹配密码的问题~~~
10. ~~~koa 有没有像 express 那样的 router.post('/users/logout', auth, async (req, res) =>? ~~~
11. ~~~数据库操作学 node 课的~~~
12. ~~~加一个 node 课的 middlewares 的 authentication？~~~
13. ~~~controllers 文件夹里面的东西，分开存放，user，article，index~~~
14. ~~~个人信息界面~~~  
15. ~~~实现登陆前导航条右侧登陆/注册，登陆后是“欢迎回来，xxx” 想法：1. toggle 2. 新建一个 block 用 if 判断~~~
16. 实时检测邮箱是否注册完成，密码是否纯数字/小于 6 位 ->ajax?  
17. 一个可以查看本站其他用户以及他们的头像？和？个人签名？  
18. ~~~点赞/踩功能 全局计数~~~  
19. 管理员管理文章页面  
20. 分页器  
21. 分类  
22. 评论区按键打开textarea  
23. 右侧个人状态  
24. 左侧导航
25. css美化  
26. 参考网站功能  
27. 做分页器的时候加一个最近文章

## 疑难点

1. 必须最后注册 z404.js 才可以避免打开任何页面都返回 404

## 已解决

## 2019-6-8 ctx.state 无法传 session 内容到前端模板

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

## 2019-6-9 多层路由下无法正确获取静态资源的问题

### 解决方法：base.html 对 css 的引用需要使用绝对路径

1. 绝对路径：“绝对”意味着相对于 Web 服务器根目录。以 / 开头，比如

```html
<img src="/web/images/example.jpg" />
```

2. 相对路径：“相对”指相对于本文件，或人为指定的某个目录。不能以 / 开头，如

```html
<!--相对于本文件-->
<img src="../images/example.jpg" />
<!--指定一个base tag，并且结尾要有斜杠"/"来表示这是一个目录-->
<!--head部分-->
<base href="localhost:8080/web/" />
<!--body部分-->
<img src="images/example.jpg" />
```
