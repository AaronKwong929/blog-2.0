const fn_index = async ctx => {
    await ctx.render('index');
};

const fn_help = async ctx => {
    await ctx.render('help');
};

const fn_about = async ctx => {
    await ctx.render('about');
}


module.exports = {
    'GET /': fn_index,
    'GET /help': fn_help,
    'GET /about': fn_about,
};
