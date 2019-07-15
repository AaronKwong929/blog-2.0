const path = require('path');
const fs = require('mz/fs');
const mime = require('mime');

var staticFiles = function(url, dir) {
    return async (ctx,next) => {
        let rpath = ctx.request.path;
        if (rpath.startsWith(url)){
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
}

module.exports = staticFiles;
