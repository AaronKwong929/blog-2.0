require('./src/db/mongoose');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const controller = require('./src/middlewares/controller');
const templating = require('./src/middlewares/templating');
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
    const staticFiles = require('./src/middlewares/static-files');
    app.use(staticFiles('/src/statics/', __dirname + '/src/statics'));
}

app.use(bodyParser());

app.use(
    templating('./src/views', {
        noCache: !isProduction,
        watch: !isProduction
    })
);
app.use(controller());
// app.listen(3000);
app.listen(3000, () => {
    console.log(`app started at port 3000`);
});