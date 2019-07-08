require('./src/configs/mongoose');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const app = new Koa();
const controller = require('./src/middlewares/controller');
const views = require('koa-views');
const session = require('koa-session');
const session_config = require('./src/configs/session');
const marked = require('marked');
const markedConfig = require('./src/configs/markedConfig');

const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
    const staticFiles = require('./src/middlewares/static-files');
    app.use(staticFiles('/src/statics/', __dirname + '/src/statics'));
}

marked.setOptions(markedConfig);

app.keys = ['yooooo'];

app.use(session(session_config, app));

app.use(bodyParser());

app.use(
    views(path.join(__dirname, 'src', 'views'), {
        map: { html: 'nunjucks' }
    })
);

app.use(async (ctx, next) => {
    ctx.state.user = ctx.session.user;
    ctx.state.marked = marked;
    await next();
});

app.use(controller());

app.listen(3000, () => {
    console.log(`app started at port 3000`);
});
