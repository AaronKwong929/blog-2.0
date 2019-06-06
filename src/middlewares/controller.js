const fs = require('fs');
const path = require('path');
const addMapping = (router, mapping) => {
    for (var url in mapping) {
        if (url.startsWith('GET')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`registering URL mapping: GET ${path}`);
        } else if (url.startsWith('PUT')) {
            var path = url.substring(4);
            router.put(path, mapping[url]);
            console.log(`registering URL mapping: PATCH ${path}`);
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

const addControllers = (router, dir) => {
    // 取上级目录
    const srcPath = path.resolve(__dirname, '..');
    // 取controllers目录
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

module.exports = dir => {
    const controllers_dir = dir || 'controllers';
    const router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();
};
