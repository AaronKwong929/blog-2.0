const fn_404 = async ctx => {
    await ctx.render('404.html');
};
module.exports = { 'GET *': fn_404 };
