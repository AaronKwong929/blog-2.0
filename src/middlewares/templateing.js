const nunjucks = require('nunjucks');

const createEnv = function(path, opts) {
    const autoescape = opts.autoescape === undefined ? true : opts.autoescape;
    const noCache = opts.noCache === undefined ? true : opts.noCache;
    const watch = opts.watch === undefined ? true : opts.watch;
    const throwOnUndefiend =
        opts.throwOnUndefiend === undefined ? true : opts.throwOnUndefiend;

    const env = new nunjucks.Environment(
        new nunjucks.FileSystemLoader(path, {
            noCache,
            watch 
        }),
        {
            autoescape,
            throwOnUndefined
        }
    );
    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
};

const templating = (path, opts) => {
    var env = createEnv(path, opts);
    return async (ctx, next) => {
        ctx.render = (view, model) => {
            ctx.response.body = env.render(view, Object.assign({}, ctx.state || {}, model || {}));
            ctx.response.type = 'text/html';
        }
        await next();
    }
}

module.exports = templating;
