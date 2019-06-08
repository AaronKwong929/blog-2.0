# 此处存放 2.0 开发废案

## Nunjucks 中间件构造

|- ./app.js

```javascript
const templating = require('./src/middlewares/templating.js');

app.use(
    templating('./src/views', {
        noCache: !isProduction,
        watch: !isProduction
    })
);
```

|- ./src/middlewares/[templating.js](https://github.com/AaronKwong929/blog-2.0/blob/master/Abolitions/templating.js)
