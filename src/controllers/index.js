const fn_index = async ctx => {
    await ctx.render('index.html');
};

const fn_help = async ctx => {
    await ctx.render('help.html');
};

const fn_about = async ctx => {
    await ctx.render('about.html');
}


module.exports = {
    'GET /': fn_index,
    'GET /help': fn_help,
    'GET /about': fn_about,
};
