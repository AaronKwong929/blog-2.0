# Aaron's blog system v2.0

## 工程记录

1. 2019-6-9 完成登陆验证和参数从后到前的传输

## 期望实现的新功能

1. ~~~采用数据库~~~
2. ~~~CSS 自己写~~~
3. ~~~textarea 有 md 功能~~~
4. ~~~登陆状态保持 koa-session~~~
5. ~~~评论区 controller~~~
6. ~~~文章 controller~~~
7. --响应式布局--
8. ~~~文章分类~~~
9. ~~~个人信息界面~~~
10. ~~~实现登陆前导航条右侧登陆/注册，登陆后是“欢迎回来，xxx” 想法：1. toggle 2. 新建一个 block 用 if 判断~~~
11. --实时检测邮箱是否注册完成，密码是否纯数字/小于 6 位 ->ajax?--
12. 一个可以查看本站其他用户以及他们的头像？和？个人签名？
13. ~~~点赞/踩功能 全局计数~~~
14. 分页器, 最近文章
15. 分类
16. ~~~评论区按键打开 textarea~~~
17. ~~~一个错误 html，不同的错误信息 message:"错误出处"~~~
18. 三列布局换两列
19. comment.js 修改 btn id

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
