const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const fn_signin = async ctx => {
    if (ctx.method === 'GET') {
        await ctx.render('signin');
    } else if (ctx.method === 'POST') {
        try {
            const email = ctx.request.body.email,
                password = ctx.request.body.password,
                user = await User.findOne({ email });
            if (!user) {
                throw new Error();
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error();
            }
            ctx.session.user = {
                id: user._id,
                name: user.name,
                email: user.email
            };
            await ctx.render('profile', {
                name: user.name
            });
        } catch (e) {
            await ctx.render('signin-failed');
        }
    }
};

const fn_signup = async ctx => {
    if (ctx.method === 'GET') {
        await ctx.render('signup');
    } else if (ctx.method === 'POST') {
        console.log(ctx.request.body);
        const user = new User(ctx.request.body);
        try {
            await user.save();
            ctx.response.status = 201;
            ctx.response.body = 'Sign up successful';
        } catch (e) {
            ctx.response.status = 400;
            ctx.response.body = e;
        }
    }
};

const fn_logout = async (ctx, next) => {
    ctx.session = null;
    ctx.redirect('/');
}

module.exports = {
    'GET /signin': fn_signin,
    'POST /signin': fn_signin,
    'GET /signup': fn_signup,
    'POST /signup': fn_signup,
    'GET /logout': fn_logout
};
