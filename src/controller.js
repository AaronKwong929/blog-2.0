const fs = require('fs');
const addMapping = (router, mapping) => {
    for (var url in mapping) {
        if (url.startsWith('GET')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`registering URL mapping: GET ${path}`);
        } else if (url.startsWith('PATCH')) {
            var path = url.substring(4);
            router.patch(path, mapping[url]);
            console.log(`registering URL mapping: PATCH ${path}`);
        } else if (url.startsWith('DELETE')) {
            var path = url.substring(4);
            router.delete(path, mapping[url]);
            console.log(`registering URL mapping: DELETE ${path}`);
        } else if (url.startsWith('POST')) {
            var path = url.substring(4);
            router.post(path, mapping[url]);
            console.log(`registering URL mapping: POST ${path}`);
        }
    }
};

const addControllers = (router, dir) => {
    var files = fs.readdirSync(__dirname + '/' + dir);
    var js_files = files.filter(f => f.endsWith('.js'));
    for (f of js_files) {
        console.log(`processing controller: ${f}`);
        let mapping = require(__dirname + '/controllers/' + f);
        addMapping(router, mapping);
    }
};

module.exports = (dir) => {
    let controllers_dir = dir || 'controllers';
    let router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();
}