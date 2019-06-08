const fn_404 = async ctx => {
    await ctx.render('404');
};
module.exports = { 'GET *': fn_404 };
