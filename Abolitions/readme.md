# 此处存放 2.0 开发废案

## 1. nunjucks模板渲染改用为koa-views

/app.js

```javascript
const templating = require('./src/middlewares/templating.js');

app.use(
    templating('./src/views', {
        noCache: !isProduction,
        watch: !isProduction
    })
);
```

[/src/middlewares/templating.js](https://github.com/AaronKwong929/blog-2.0/blob/master/Abolitions/templating.js)
