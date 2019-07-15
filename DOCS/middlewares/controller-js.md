# 关于controller.js

## 参考自廖雪峰的 node 课程

```javascript
const addMapping = (router, mapping) => {
    for (var url in mapping) {
        if (url.startsWith('GET')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`registering URL mapping: GET ${path}`);
        } else if (url.startsWith('PUT')) {
            var path = url.substring(4);
            router.put(path, mapping[url]);
            console.log(`registering URL mapping: PUT ${path}`);
        } else if (url.startsWith('DELETE')) {
            var path = url.substring(7);
            router.del(path, mapping[url]);
            console.log(`registering URL mapping: DELETE ${path}`);
        } else if (url.startsWith('POST')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`registering URL mapping: POST ${path}`);
        } else {
            console.log(`Invalid URL`);
        }
    }
};
```

分别处理以 GET, PUT, DELETE, POST 开头的地址，.substring(num) num = .length + 1，如去掉“get ”。

```javascript
const addControllers = (router, dir) => {
    const srcPath = path.resolve(__dirname, '..');
    const controllersPath = path.join(srcPath, dir);
    fs.readdir(controllersPath, (err, files) => {
        if (err) {
            return err;
        }
        var js_files = files.filter(f => f.endsWith('.js'));
        for (f of js_files) {
            console.log(`processing controller: ${f}`);
            let mapping = require(controllersPath + '/' + f);
            addMapping(router, mapping);
        }
    });
};
```

[path.resolve()](http://nodejs.cn/api/path.html#path_path_resolve_paths)  
若当前路径为/abc/def，path.resole(__dirname, '..');
则返回/abc，用此法取得middlewares文件夹的上级目录即/src，再用path.join() 获得/src/controllers 地址  
  
fs.readdir() -> 读取目录的内容  
files.filter() -> 筛选js文件  
${controllersPath}/${f} -> 该js文件的完整目录  

```javascript
module.exports = dir => {
    const controllers_dir = dir || 'controllers';
    const router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();
};
```

如果没有指定目录则默认为controllers目录
