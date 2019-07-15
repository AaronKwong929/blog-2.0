# 编写过程中遇到的问题以及解法

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

***中间件的执行顺序***

## 2019-6-9 多层路由下无法正确获取静态资源的问题

### 解决方法：base.html 对 css 的引用需要使用绝对路径

***绝对路径：“绝对”意味着相对于 Web 服务器根目录。以 / 开头***

```html
<img src="/web/images/example.jpg" />
```

***相对路径：“相对”指相对于本文件，或人为指定的某个目录。不能以 / 开头***

```html
<!--相对于本文件-->
<img src="../images/example.jpg" />
<!--指定一个base tag，并且结尾要有斜杠"/"来表示这是一个目录-->
<!--head部分-->
<base href="localhost:8080/web/" />
<!--body部分-->
<img src="images/example.jpg" />
```
