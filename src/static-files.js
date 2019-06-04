const path = require('path');
const fs = require('mz/fs');
const mime = require('mime');

//url类似于'/static/'
//dir类似于__dirname + '/static'
var staticFiles = function(url, dir) {
    return async (ctx,next) => {
        let rpath = ctx.request.path;
        if (rpath.startsWith(url)){
            // 获取文件完整路径
            let fp = path.join(dir, rpath.substring(url.length));  // 从/static/之后开始截取
            // 判断文件是否存在
            if (await fs.existsSync(fp)) {
                //查找文件的mime
                ctx.response.type = mime.getType(rpath);
                // mime是查找类型，返回的是'text/css'
                // 读取文件内容 赋值给response.body：
                ctx.response.body = await fs.readFile(fp);
            } else {
                //文件不存在
                ctx.response.status = 404;
            }
        } else {
            //不是指定前缀的url，继续处理下一个middleware
            await next();
        }
    };
}

module.exports = staticFiles;

// 使用了mz，并通过require('mz/fs');导入。mz提供的API和Node.js的fs模块完全相同，但fs模块使用回调，而mz封装了fs对应的函数，并改为Promise。这样，我们就可以非常简单的用await调用mz的函数，而不需要任何回调。