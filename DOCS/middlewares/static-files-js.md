# [static-files.js - 用于处理静态资源](https://github.com/AaronKwong929/blog-2.0/blob/master/src/middlewares/static-files.js)

参考自廖雪峰的 node 课程

path, fs, mime

url 类似于'/static/'  
dir 类似于__dirname + '/static'

```javascript
var staticFiles = function(url, dir) {
    return async (ctx, next) => {
        let rpath = ctx.request.path;
        if (rpath.startsWith(url)) {
            let fp = path.join(dir, rpath.substring(url.length));
            if (await fs.existsSync(fp)) {
                ctx.response.type = mime.getType(rpath);
                ctx.response.body = await fs.readFile(fp);
            } else {
                ctx.response.status = 404;
            }
        } else {
            await next();
        }
    };
};

module.exports = staticFiles;
```

mime 是查找类型，返回的是'text/css'

读取文件内容 赋值给 response.body

不是指定前缀的 url，继续处理下一个 middleware

通过require('mz/fs')导入mz。mz提供的API和Node.js的fs模块完全相同，但fs模块使用回调，而mz封装了fs对应的函数，并改为Promise。就可以非常简单地用await调用mz的函数，而不需要任何回调。

app.js:

```javascript
const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
    const staticFiles = require('./src/middlewares/static-files');
    app.use(staticFiles('/src/statics/', __dirname + '/src/statics'));
}
```
